import Image from 'next/image';

import Bookmark from '@assets/ico_bookmark.svg';
import Hide from '@assets/ico_hide.svg';
import SampleProflie from '@assets/ico_sampleProfile.svg';
import { TextMedium, TextSmall } from '@styles/common';

import {
  TocWrapper,
  TocSideBar,
  TocIcons,
  TocTitle,
  TocContainer,
  TocList,
  TocProfile,
  TocProfileText,
  TocImgWrapper,
} from './styled';

const sampleData = {
  bookmarkNum: 398,
  bookTitle: '리액트 마스터하기',
  articles: ['Create-react-app', 'JSX'],
  username: 'Web01',
};

interface TocProps {
  book: any;
}

export default function TOC({ book }: TocProps) {
  return (
    <TocWrapper>
      <TocSideBar>
        <TocIcons>
          <Image src={Bookmark} alt="Viewer Icon" />
          <Image src={Hide} alt="Viewer Icon" />
        </TocIcons>
        <TextSmall>{book._count.bookmarks}</TextSmall>
        <TocTitle>{book.title}</TocTitle>

        <TocContainer>
          <TextMedium>목차</TextMedium>
          <TocList>
            {book.scraps.map((v) => {
              return (
                <TextSmall key={v.order}>
                  {v.order}.{v.article.title}
                </TextSmall>
              );
            })}
          </TocList>
        </TocContainer>
      </TocSideBar>
      <TocProfile>
        <TocProfileText>
          <TextSmall>Written by</TextSmall>
          <TextMedium>{book.user.nickname}</TextMedium>
        </TocProfileText>
        <TocImgWrapper src={SampleProflie} alt="Viewer Icon" />
      </TocProfile>
    </TocWrapper>
  );
}
