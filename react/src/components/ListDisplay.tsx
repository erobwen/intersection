import { Modal, Paper, Button, Typography, Box } from "@mui/material";
import { backgroundEmphasis, fillerStyle, rowStyle } from "./styles";
import { useCallback, useState } from "react";

export const ListDisplay = ({list, name}: {list: string[], name: string}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const onOpenModal = useCallback(() => {
    setModalOpen(true);
  }, [setModalOpen]) 

  const onCloseModal = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]) 

  return (
    <Paper sx={{...rowStyle, ...backgroundEmphasis, overflow: "hidden", textOverflow: "ellipsis"}}>
      <Typography sx={{whiteSpace: "nowrap", fontWeight: 700}}>{name}</Typography>
      <Box onClick={onOpenModal} sx={{...fillerStyle, cursor: "pointer", overflow: "hidden"}}>
        <Typography id="list" sx={{width: "100%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "left"}}>
          {`[${list.join(", ")}]`}
        </Typography>
      </Box>
      <Modal open={isModalOpen} onClose={onCloseModal}>
        <div>
          <ModalContent header={name} onClose={onCloseModal}>
            <Typography>{`[${list.join(", ")}]`}</Typography>
          </ModalContent>
        </div>
      </Modal>
    </Paper>
  );
} 

export const ModalContent = ({header, onClose, okEnabled=true, children}: 
  {
    header: string,
    onClose: any,
    okEnabled?: boolean, 
    children: any
  }) => {
  return (
    <Paper sx={{
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60%", height: "60%",
      display: "flex", flexDirection: "column", justifyContent:"space-between", alignItems: "flex-start", padding: "20px"
      }}>
      <Typography sx={{marginTop: "0px"}}>{header}</Typography>
      <Box sx={{maxHeight: "400px", overflowY: "auto", overflowX:"hidden"}}>
        {children}
      </Box>
      <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end", width: "100%"}}>
        {onClose && <Button disabled={!okEnabled} onClick={onClose}>Close</Button>}
      </Box>
    </Paper>
  )
}
  