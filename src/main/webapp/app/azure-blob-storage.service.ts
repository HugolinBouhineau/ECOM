import { Injectable } from '@angular/core';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

@Injectable({
  providedIn: 'root',
})
export class AzureBlobStorageService {
  accountName = 'ecom1465';
  containerName = 'test';

  public uploadImage(sas: string, content: Blob, name: string, handler?: () => void): void {
    this.uploadBlob(content, name, this.containerClient(sas), handler);
  }

  private uploadBlob(content: Blob, name: string, client: ContainerClient, handler?: () => void): void {
    const blockBlobClient = client.getBlockBlobClient(name);
    if (handler) {
      blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type } }).then(() => handler());
    } else {
      blockBlobClient.uploadData(content, { blobHTTPHeaders: { blobContentType: content.type } });
    }
  }

  private containerClient(sas: string): ContainerClient {
    return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${sas}`).getContainerClient(this.containerName);
  }
}
