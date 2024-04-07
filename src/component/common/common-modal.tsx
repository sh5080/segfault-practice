import * as React from "react";
import { Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
    minWidth: "500px",
    minHeight: "400px",
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface CommonModalProps {
  title: string;
  subTitle?: string;
  isOpen: boolean;
  handleClose: () => void;
  content: React.ReactNode;
  actions?: React.ReactNode;
}

export const CommonModal: React.FC<CommonModalProps> = ({
  title,
  subTitle,
  content,
  isOpen,
  handleClose,
  actions,
}) => {
  const handleCloseModal = (reason: string) => {
    if (reason === "backdropClick") {
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <div>
            <Typography variant="h5">{title}</Typography>
            {subTitle && (
              <Typography variant="subtitle2" color="textSecondary">
                {subTitle}
              </Typography>
            )}
          </div>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>{content}</DialogContent>
        {actions ? <DialogActions>{actions}</DialogActions> : null}
      </BootstrapDialog>
    </React.Fragment>
  );
};

CommonModal.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  actions: PropTypes.node,
};
