import * as React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { isNotEmpty, isValidEmail } from "lib/validate";
import { authClient } from "lib/auth";
import { SignupDto } from "type/dto/auth.dto";
import { CommonModal } from "component/common/common-modal";
import { Card, CardContent } from "@mui/material";

export function SignUpForm({ isOpen, handleClose }): React.JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const onSubmit = async (dto: SignupDto) => {
    setIsPending(true);

    const { name, email, password, passwordConfirm } = dto;
    if (!isNotEmpty(name)) {
      setError("root", { message: "이름을 입력하세요." });
      setIsPending(false);
      return;
    }
    if (!isNotEmpty(email)) {
      setError("root", { message: "이메일을 입력하세요." });
      setIsPending(false);
      return;
    }
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
    if (!isNotEmpty(passwordConfirm)) {
      setError("root", { message: "패스워드 확인을 입력하세요." });
      setIsPending(false);
      return;
    }
    if (password !== passwordConfirm) {
      setError("root", {
        message: "패스워드와 패스워드 확인이 일치하지 않습니다..",
      });
      setIsPending(false);
      return;
    }
    try {
      // 회원가입 API 호출
      const signupRes = await authClient.signup(dto);
      console.log("회원가입시 응답값!: ", signupRes);
      // 회원가입 성공 시 리다이렉트 또는 다른 처리 수행
    } catch (err) {
      setError("root", { type: "server", message: err.message });
      setIsPending(false);
    }
  };

  return (
    <CommonModal
      title={"회원가입"}
      subTitle={""}
      isOpen={isOpen}
      handleClose={() => handleClose("backdropClick")}
      content={
        <Card>
          <CardContent>
            <Stack spacing={4}>
              <Typography variant="h4">회원가입</Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.email)}>
                        <InputLabel>Email 주소</InputLabel>
                        <OutlinedInput
                          {...field}
                          label="Email 주소"
                          type="email"
                        />
                      </FormControl>
                    )}
                  />
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.password)}>
                        <InputLabel>비밀번호</InputLabel>
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
                          label="비밀번호"
                          type={showPassword ? "text" : "password"}
                        />
                      </FormControl>
                    )}
                  />
                  {errors.root && (
                    <Alert
                      color="error"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      {errors.root.message}
                    </Alert>
                  )}
                  <Button
                    disabled={isPending}
                    type="submit"
                    variant="contained"
                  >
                    회원가입
                  </Button>
                </Stack>
              </form>
            </Stack>
          </CardContent>
        </Card>
      }
    />
  );
}
