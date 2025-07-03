import React, { Children } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";

const ModelPopup = ({
  children,
}: {
  children: any;
}) => {

  const {isOpen, onOpenChange} = useDisclosure();

  return(
    <Modal 
      backdrop="blur" 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      classNames={{
        backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {children}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModelPopup;

