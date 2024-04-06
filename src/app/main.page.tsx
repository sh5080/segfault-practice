import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
import React from "react";
import { paths } from "route/path";
import { useUser } from "state/user.state";
import { User } from "type/user.type";

export default function MainPage() {
  const { nickname, role }: User = useUser();
  const handleLogout = () => {
    window.location.href = paths.auth.signIn;
  };

  return (
    <Container maxWidth="sm">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Main Page
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ marginRight: "20px" }}
          >
            {nickname} ({role})
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Typography variant="body1" gutterBottom>
        Welcome to the main page!
      </Typography>
    </Container>
  );
}
