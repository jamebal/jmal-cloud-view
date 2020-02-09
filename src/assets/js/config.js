export const ACCEPT_CONFIG = {
    image: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'],
    video: ['.mp4', '.rmvb', '.mkv', '.wmv', '.flv'],
    document: ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.tif', '.tiff'],
    audio: ['.mp3'],
    application: ['.zip', '.rar'],
    getAll(){
        return [...this.image, ...this.video, ...this.document, ...this.audio, ...this.application]
    },
};
