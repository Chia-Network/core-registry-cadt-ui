import React from 'react';
import { withTheme } from 'styled-components';

const InfoIconSmall = withTheme(({ width, height }) => {
  return (
    <>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M7 0C3.13438 0 0 3.13438 0 7C0 10.8656 3.13438 14 7 14C10.8656 14 14 10.8656 14 7C14 3.13438 10.8656 0 7 0ZM7.5 10.375C7.5 10.4438 7.44375 10.5 7.375 10.5H6.625C6.55625 10.5 6.5 10.4438 6.5 10.375V6.125C6.5 6.05625 6.55625 6 6.625 6H7.375C7.44375 6 7.5 6.05625 7.5 6.125V10.375ZM7 5C6.80374 4.99599 6.61687 4.91522 6.47948 4.775C6.3421 4.63478 6.26515 4.4463 6.26515 4.25C6.26515 4.0537 6.3421 3.86522 6.47948 3.725C6.61687 3.58478 6.80374 3.50401 7 3.5C7.19626 3.50401 7.38313 3.58478 7.52052 3.725C7.6579 3.86522 7.73485 4.0537 7.73485 4.25C7.73485 4.4463 7.6579 4.63478 7.52052 4.775C7.38313 4.91522 7.19626 4.99599 7 5Z"
          fill="#1890FF"
        />
      </svg>
    </>
  );
});

export { InfoIconSmall };