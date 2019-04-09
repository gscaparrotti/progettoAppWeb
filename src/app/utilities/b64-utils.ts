export module b64Utils {
  export function b64ToBlob(b64Data: string, contentType?: string): Blob {
    const byteCharacters = atob(b64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    let blob: Blob;
    if (contentType !== undefined) {
      blob = new Blob([byteArray], {type: contentType});
    } else {
      blob = new Blob([byteArray]);
    }
    return blob;
  }
}
