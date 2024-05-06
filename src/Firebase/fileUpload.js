import { ref, getDownloadURL, uploadBytesResumable, getStorage } from 'firebase/storage';
import { fbStorage } from './index';

export const imgUploadFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return {
        err: 'An error occurred while uploading',
      };
    }

    const storageRef = ref(fbStorage, `/images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.error(error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          resolve(url);
        });
      },
    );
  });
};
