import { memo, useEffect, useMemo, useState } from 'react';
import logo from '../../../public/assets/katanoff-loading.webp';

const ProgressiveImg = ({
  placeholderSrc = logo,
  src,
  placeHolderClassName = '',
  customClassName = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImgSrc(src);
    };
  }, [src]);

  const customClass = useMemo(() => {
    return placeholderSrc && imgSrc === placeholderSrc
      ? `progressive-img-loading object-contain ${placeHolderClassName}`
      : `poprogressive-img-loaded object-cover w-full h-[280px] ${customClassName}`;
  }, [imgSrc, placeholderSrc]);

  return <img {...{ src: imgSrc, ...props }} alt={props.alt || ''} className={` ${customClass}`} />;
};

export default memo(ProgressiveImg);
