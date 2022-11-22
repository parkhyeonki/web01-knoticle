import { Request, Response } from 'express';

import authService from '@apis/auth/auth.service';
import { ResourceConflict, Unauthorized, Message } from '@errors';

const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (/[^a-zA-Z0-9]/.test(username) || username.length > 10)
    throw new Unauthorized(Message.AUTH_WRONG);

  const user = await authService.getSignedUser(username, password);

  const { accessToken, refreshToken } = authService.getTokens(user.id, user.nickname);

  await authService.saveRefreshToken(user.id, refreshToken);

  res.cookie('access_token', accessToken, { httpOnly: true });
  res.cookie('refresh_token', refreshToken, { httpOnly: true });

  res.status(200).send({ id: user.id, nickname: user.nickname });
};

const signInGithub = async (req: Request, res: Response) => {
  const { code } = req.body;

  const githubAccessToken = await authService.getGithubAccessToken(code);

  const { username, provider_id } = await authService.getUserByGithubAPI(githubAccessToken);

  const githubUser =
    (await authService.getUserByLocalDB(provider_id)) ||
    (await authService.signUpGithubUser(username, provider_id));

  const { accessToken, refreshToken } = authService.getTokens(githubUser.id, githubUser.nickname);

  await authService.saveRefreshToken(githubUser.id, refreshToken);

  res.cookie('access_token', accessToken, { httpOnly: true });
  res.cookie('refresh_token', refreshToken, { httpOnly: true });

  res.status(200).send({ id: githubUser.id, nickname: githubUser.nickname });
};

const signUp = async (req: Request, res: Response) => {
  const { username, password, nickname } = req.body;

  if (!(await authService.checkLocalUsernameUnique(username))) {
    throw new ResourceConflict(Message.AUTH_USERNAME_OVERLAP);
  }
  if (!(await authService.checkNicknameUnique(nickname))) {
    throw new ResourceConflict(Message.AUTH_NICKNAME_OVERLAP);
  }

  res.status(200).send();
};

export default {
  signIn,
  signInGithub,
  signUp,
};
