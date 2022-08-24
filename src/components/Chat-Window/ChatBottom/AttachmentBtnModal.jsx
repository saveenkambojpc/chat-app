import React, { useState } from 'react';
import { useParams } from 'react-router';
import { Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const MAXFILESIZE = 1024 * 1024 * 5;

const AttachmentBtnModal = ({ afterUpload }) => {
  const { isOpen, open, close } = useModalState();

  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { chatId } = useParams();

  const onChange = filesArr => {
    const filtered = filesArr
      .filter(e => e.blobFile.size <= MAXFILESIZE)
      .slice(0, 5);
    setFileList(filtered);

  };

    const onUploadBtn = async () => {
      try {
        const uploadPromises = fileList.map(f => {
          return storage
            .ref(`/chat/${chatId}`)
            .child(Date.now() + f.name)
            .put(f.blobFile, { cacheControl: `public age-${3600 * 24 * 3}` });
        });

        const uploadSnapshots = await Promise.all(uploadPromises);

        const shapePromises = uploadSnapshots.map(async snap => {
          return {
            contentType: snap.metadata.contentType,
            name: snap.metadata.name,
            url: await snap.ref.getDownloadURL(),
          };
        });

        const files = await Promise.all(shapePromises);

        await afterUpload(files);

        setIsLoading(false);
        close();
      } catch (err) {
        setIsLoading(false);
      }
    };

  return (
    <>
      <InputGroup.Button onClick={open}>
        <Icon icon="attachment" />
      </InputGroup.Button>

      <Modal show={isOpen} onHide={close}>
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            onChange={onChange}
            fileList={fileList}
            listType="picture-text"
            multiple
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            color="green"
            disabled={isLoading}
            onClick={onUploadBtn}
          >
            Upload
          </Button>
          <div className="mt-2">
            <small>only files less than 5MB are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttachmentBtnModal;
