import { useState } from 'react';

import LabeledInput from '@components/common/LabeledInput';
import Button from '@components/common/Modal/ModalButton';
import axios from 'axios';

import { SignUpModalWrapper, SignUpModalErrorMessage } from './styled';

interface SignUpModalProps {
  handleModalClose: () => void;
}

function SignUpModal({ handleModalClose }: SignUpModalProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [info, setInfo] = useState({
    username: '',
    password: '',
    nickname: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo({
      ...info,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUpBtnClick = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/signup`, info)
      .then(() => {
        handleModalClose();
      })
      .catch((err) => {
        setErrorMessage(err.response.data.message);
      });
  };

  return (
    <SignUpModalWrapper>
      <SignUpModalErrorMessage>{errorMessage}</SignUpModalErrorMessage>
      <LabeledInput
        label="아이디"
        type="text"
        name="username"
        placeholder="아이디를 입력해주세요"
        onChange={handleInputChange}
      />
      <LabeledInput
        label="비밀번호"
        type="password"
        name="password"
        placeholder="비밀번호를 입력해주세요"
        onChange={handleInputChange}
      />
      <LabeledInput
        label="닉네임"
        type="text"
        name="nickname"
        placeholder="닉네임을 입력해주세요"
        onChange={handleInputChange}
      />
      <Button theme="primary" onClick={handleSignUpBtnClick}>
        회원가입하기
      </Button>
    </SignUpModalWrapper>
  );
}

export default SignUpModal;
