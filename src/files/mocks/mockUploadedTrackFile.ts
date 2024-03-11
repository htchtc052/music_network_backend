export const mockUploadedTrackFile = (): Express.Multer.File => {
  return {
    buffer: undefined,
    destination: '',
    encoding: '',
    fieldname: '',
    stream: undefined,
    originalname: 'test_track.mp3',
    filename: 'test_track.mp3',
    size: 1024,
    path: '/path/to/test_track.mp3',
    mimetype: 'audio/mpeg',
  };
};
