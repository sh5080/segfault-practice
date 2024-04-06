import * as React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MuiLink from "@mui/material/Link";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authClient } from "lib/auth";
import { isNotEmpty, isValidEmail } from "lib/validate";
import { Controller, useForm } from "react-hook-form";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { paths } from "route/path";
import { userState } from "state/user.state";

export function SignInForm(): React.JSX.Element {
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState<boolean>();

  const [isPending, setIsPending] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: { email: string; password: string }) => {
    setIsPending(true);

    const { email, password } = data;
    if (!isValidEmail(email)) {
      setError("root", { message: "유효한 이메일 주소를 입력하세요." });
      setIsPending(false);
      return;
    }
    if (!isNotEmpty(password)) {
      setError("root", { message: "패스워드를 입력하세요." });
      setIsPending(false);
      return;
    }

    try {
      const loginRes = await authClient.login({ email, password });

      if (loginRes.nickname && loginRes.role) {
        setUser({ nickname: loginRes.nickname, role: loginRes.role });
        navigate(paths.home);
      }
    } catch (err) {
      setError("root", { type: "server", message: err.message });
      setIsPending(false);
      return;
    }
  };

  return (
    <Stack spacing={4}>
      <Typography variant="h4">로그인</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <FormControl error={Boolean(errors.email)}>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput {...field} label="Email address" type="email" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <FormControl error={Boolean(errors.password)}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  endAdornment={
                    showPassword ? (
                      <Visibility
                        cursor="pointer"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <VisibilityOff
                        cursor="pointer"
                        onClick={() => setShowPassword(true)}
                      />
                    )
                  }
                  label="Password"
                  type={showPassword ? "text" : "password"}
                />
              </FormControl>
            )}
          />
          <div>
            <MuiLink
              component={RouterLink}
              to={paths.auth.resetPassword}
              variant="subtitle2"
            >
              비밀번호를 잊으셨나요?
            </MuiLink>
          </div>
          {errors.root && (
            <Alert
              color="error"
              style={{ display: "flex", alignItems: "center" }}
            >
              {errors.root.message}
            </Alert>
          )}

          <Button disabled={isPending} type="submit" variant="contained">
            로그인
          </Button>
        </Stack>
      </form>
      <Alert color="warning">회원가입은 별도로 문의해주세요. </Alert>
    </Stack>
  );
}
