import Image from 'next/image';

import { useContext, useEffect, useRef, useState } from 'react';

import { useRecoilState } from 'recoil';

import { editBookApi } from '@apis/bookApi';
import { createImageApi } from '@apis/imageApi';
import Edit from '@assets/ico_edit.svg';
import MoreContentsIcon from '@assets/ico_more_contents.svg';
import curKnottedBookListState from '@atoms/curKnottedBookList';
import editInfoState from '@atoms/editInfo';
import scrapState from '@atoms/scrap';
import DragArticle from '@components/common/DragDrop';
import Button from '@components/common/Modal/ModalButton';
import useFetch from '@hooks/useFetch';
import useInput from '@hooks/useInput';
import { IBookScraps } from '@interfaces';
import { FlexSpaceBetween } from '@styles/layout';
import { IEditScrap } from 'interfaces/scrap.interface';

import {
  BookWrapper,
  BookInfoContainer,
  BookTitle,
  BookContentsInfo,
  BookThumbnail,
  Author,
  Input,
  BookContent,
  EditBookWapper,
  EditBookThumbnailWrapper,
  EditBookThumbnailIcon,
  MoreContentsIconWrapper,
} from './styled';

interface BookProps {
  book: IBookScraps;
  handleModalClose: () => void;
}

export default function EditBook({ book, handleModalClose }: BookProps) {
  const { id, title, user, scraps } = book;

  const { data: imgFile, execute: createImage } = useFetch(createImageApi);
  const { data: editBookData, execute: editBook } = useFetch(editBookApi);
  const { value: titleData, onChange: onTitleChange } = useInput(title);

  const [editInfo, setEditInfo] = useRecoilState(editInfoState);
  const [curKnottedBookList, setCurKnottedBookList] = useRecoilState(curKnottedBookListState);
  const [scrapList] = useRecoilState<any>(scrapState);

  const [isContentsShown, setIsContentsShown] = useState(false);

  const inputFile = useRef<HTMLInputElement | null>(null);

  const handleEditBookImgClick = () => {
    if (!inputFile.current) return;
    inputFile.current.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    if (!event.target.files) return;

    const formData = new FormData();
    formData.append('image', event.target.files[0]);
    createImage(formData);
  };

  const handleCompletedBtnClick = () => {
    const editScraps = scrapList.map((v: IEditScrap, i: number) => ({ ...v, order: i + 1 }));

    // 해당하는 책을 찾아서 전역에서 관리하고 있는 애를 변경해서 업데이트
    setCurKnottedBookList([
      ...curKnottedBookList.map((curBook) => {
        if (id === curBook.id) {
          return {
            ...curBook,
            title: titleData,
            thumbnail_image: imgFile?.imagePath || book.thumbnail_image,
            scraps: editScraps,
          };
        }
        return curBook;
      }),
    ]);

    // editInfo에 정보 담아놓기
    setEditInfo({
      ...editInfo,
      editted: [
        ...editInfo.editted,
        {
          id,
          title: titleData,
          thumbnail_image: imgFile?.imagePath || book.thumbnail_image,
          scraps: editScraps,
        },
      ],
    });

    handleModalClose();

    // editBook({
    //   id,
    //   title: titleData,
    //   thumbnail_image: imgFile?.imagePath || book.thumbnail_image,
    //   scraps: editScraps,
    // });
  };

  const handleContentsOnClick = () => {
    setIsContentsShown((prev) => !prev);
  };

  return (
    <EditBookWapper>
      <BookWrapper>
        {isContentsShown ? null : (
          <EditBookThumbnailWrapper>
            <BookThumbnail
              src={imgFile?.imagePath || book.thumbnail_image}
              alt="thumbnail"
              width={318}
              height={220}
            />
            <EditBookThumbnailIcon onClick={handleEditBookImgClick}>
              <Image src={Edit} alt="profile_edit" width={20} />
              <input
                type="file"
                id="file"
                ref={inputFile}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </EditBookThumbnailIcon>
          </EditBookThumbnailWrapper>
        )}
        <BookInfoContainer>
          {isContentsShown ? null : (
            <FlexSpaceBetween>
              <BookTitle>
                <Input type="text" defaultValue={titleData} onChange={onTitleChange} />
                <Author>by {user.nickname}</Author>
              </BookTitle>
            </FlexSpaceBetween>
          )}

          <BookContentsInfo>
            <BookContent>Contents</BookContent>
            <DragArticle data={scraps} isContentsShown={isContentsShown} />
          </BookContentsInfo>
        </BookInfoContainer>
        <MoreContentsIconWrapper onClick={handleContentsOnClick}>
          <Image src={MoreContentsIcon} alt="More Contents Icon" width={12} height={12} />
        </MoreContentsIconWrapper>
      </BookWrapper>
      <Button theme="primary" onClick={handleCompletedBtnClick}>
        수정 완료
      </Button>
    </EditBookWapper>
  );
}
