import styled from 'styled-components';

import { TextLarge, TextMedium, TextXSmall } from '@styles/common';

export const ModifyModalWrapper = styled.div`
  margin-top: 32px;

  > div {
    margin-bottom: 16px;
  }
`;

export const Label = styled(TextLarge)``;
export const ArticleWrapper = styled.div`
  width: 100%;
  height: 300px;
  overflow: scroll;
  border-top: 1px solid var(--grey-02-color);
`;

export const WarningLabel = styled(TextMedium)`
  color: var(--red-color);
`;

export const DragArticleText = styled(TextXSmall)`
  padding: 5px;
  text-align: center;
`;
