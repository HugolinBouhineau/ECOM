package com.mycompany.myapp.service;

import com.azure.core.util.BinaryData;
import com.azure.core.util.Context;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.models.BlobRequestConditions;
import com.azure.storage.blob.options.BlobParallelUploadOptions;
import com.mycompany.myapp.domain.CommandItem;
import com.mycompany.myapp.domain.Plant;
import com.mycompany.myapp.domain.PlantQuantity;
import java.io.IOException;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class PlantService {

    private final Logger log = LoggerFactory.getLogger(PlantService.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Boolean verifyAndUpdateStock(@RequestBody PlantQuantity[] quantitiesAsked) {
        log.debug("REST request to verifyStock :");
        for (PlantQuantity quantityAsked : quantitiesAsked) {
            Plant plant = entityManager.find(Plant.class, quantityAsked.getPlantId(), LockModeType.PESSIMISTIC_WRITE);
            int remainingStock = plant.getStock() - quantityAsked.getPlantQuantity();
            if (remainingStock < 0) {
                log.debug(
                    "plante {} pas en stock, asked: {}, stock: {}",
                    quantityAsked.getPlantId(),
                    quantityAsked.getPlantQuantity(),
                    plant.getStock()
                );
                throw new DataIntegrityViolationException("Une plante n'est plus en stock dans la quantité demandé");
            } else {
                plant.setStock(remainingStock);
                log.debug(
                    "plante {} en stock, asked: {}, stock: {}, remaining: {}",
                    quantityAsked.getPlantId(),
                    quantityAsked.getPlantQuantity(),
                    plant.getStock(),
                    remainingStock
                );
            }
        }
        return true;
    }

    @Transactional
    public Boolean refillPlant(@RequestBody long commandId, List<CommandItem> list_command) {
        log.debug("REST request to refillPlant for {}:", commandId);
        for (CommandItem command : list_command) {
            log.debug("item : {} ", command.getCommand().getId());
            if (command.getCommand().getId() == commandId) {
                Plant plant = entityManager.find(Plant.class, command.getPlant().getId(), LockModeType.PESSIMISTIC_WRITE);
                int refillStock = plant.getStock() + command.getQuantity();
                plant.setStock(refillStock);
                log.debug(
                    "plante {} en stock, asked: {}, stock: {}, now: {}",
                    command.getPlant().getId(),
                    command.getQuantity(),
                    plant.getStock(),
                    refillStock
                );
            }
        }
        return true;
    }

    public boolean uploadImage(MultipartFile file) throws IOException {
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
            .endpoint("https://ecom1465.blob.core.windows.net/")
            .sasToken(
                "sp=racwdli&st=2023-11-18T13:43:30Z&se=2024-01-01T21:43:30Z&spr=https&sv=2022-11-02&sr=c&sig=7az5ERRS2B0gz%2F72aHTdDAQgSWu4g53NJDqxPUWiB5Q%3D"
            )
            .buildClient();

        BlobContainerClient container = blobServiceClient.getBlobContainerClient("test");

        BlobClient blob = container.getBlobClient(file.getOriginalFilename());

        BinaryData binaryData = BinaryData.fromStream(file.getInputStream(), file.getSize());
        BlobParallelUploadOptions options = new BlobParallelUploadOptions(binaryData);
        BlobHttpHeaders blobHttpHeaders = new BlobHttpHeaders();
        blobHttpHeaders.setContentType(file.getContentType());
        options.setRequestConditions(new BlobRequestConditions()).setHeaders(blobHttpHeaders);
        blob.uploadWithResponse(options, null, Context.NONE);

        return true;
    }
}
