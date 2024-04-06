import React from "react";
import { FallbackProps } from "react-error-boundary";
import { Button, Typography, Paper } from "@mui/material";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <Paper
      sx={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        marginTop: "50px",
      }}
    >
      <Typography variant="h6" gutterBottom>
        오류가 발생했습니다.
      </Typography>
      <Typography variant="body1" gutterBottom>
        {error && error.toString()}
      </Typography>
      <Typography variant="body1" gutterBottom>
        재시도 해주세요.
      </Typography>
      <Button variant="contained" color="primary" onClick={resetErrorBoundary}>
        재시도
      </Button>
    </Paper>
  );
};
