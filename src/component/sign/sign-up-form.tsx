import * as React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { isNotEmpty, isValidEmail, isValidPassword } from "lib/validate";
import { SignupDto } from "type/dto/auth.dto";
import { CommonModal } from "component/common/common-modal";
import { Card, CardContent } from "@mui/material";
import UserApi from "api/user";

export function SignUpForm({ isOpen, handleClose }): React.JSX.Element {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPasswordConfirm, setShowPasswordConfirm] =
    useState<boolean>(false);
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

    const setErrorAndFinish = (message: string) => {
      setError("root", { message });
      setIsPending(false);
    };

    const validateField = (
      value: string,
      fieldName: string,
      errorMessage: string
    ) => {
      if (!isNotEmpty(value)) {
        setErrorAndFinish(errorMessage);
        return false;
      }
      return true;
    };

    if (!validateField(name, "이름", "이름을 입력하세요.")) return;
    if (!validateField(email, "이메일", "이메일을 입력하세요.")) return;
    if (!isValidEmail(email)) {
      setErrorAndFinish("유효한 이메일 주소를 입력하세요.");
      return;
    }
    if (!validateField(password, "패스워드", "패스워드를 입력하세요.")) return;
    if (
      !validateField(
        passwordConfirm,
        "패스워드 확인",
        "패스워드 확인을 입력하세요."
      )
    )
      return;
    if (!isValidPassword(password) || !isValidPassword(passwordConfirm)) {
      setErrorAndFinish(
        `영문, 숫자, 특수문자로 이루어진 8자 이상의 ${
          !isValidPassword(password) ? "패스워드" : "패스워드 확인"
        }를 설정해주세요.`
      );
      return;
    }
    if (password !== passwordConfirm) {
      setErrorAndFinish("패스워드와 패스워드 확인이 일치하지 않습니다.");
      return;
    }

    try {
      // 회원가입 API 호출
      const signupRes = await UserApi.signup(dto);
      console.log("회원가입시 응답값!: ", signupRes);
    } catch (err) {
      console.log("durltjs? ", err);
      setError("root", { type: "server", message: err.message });
    } finally {
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
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.email)}>
                        <InputLabel>이름</InputLabel>
                        <OutlinedInput {...field} label="이름" type="name" />
                      </FormControl>
                    )}
                  />
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
                  <Controller
                    control={control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormControl error={Boolean(errors.passwordConfirm)}>
                        <InputLabel>비밀번호 확인</InputLabel>
                        <OutlinedInput
                          {...field}
                          endAdornment={
                            showPasswordConfirm ? (
                              <Visibility
                                cursor="pointer"
                                onClick={() => setShowPasswordConfirm(false)}
                              />
                            ) : (
                              <VisibilityOff
                                cursor="pointer"
                                onClick={() => setShowPasswordConfirm(true)}
                              />
                            )
                          }
                          label="비밀번호 확인"
                          type={showPasswordConfirm ? "text" : "password"}
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
