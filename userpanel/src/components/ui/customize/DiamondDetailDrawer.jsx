const DiamondDetailDrawer = ({ cartItem, isCartPopupPage }) => {
  if (!cartItem?.diamondDetail) return null;

  return (
    <div className={`${!isCartPopupPage ? "mt-1" : ""}`}>
      <h4 className="font-semibold text-sm md:text-base">Your Diamond</h4>

      <div
        className={`flex flex-wrap text-baseblack font-medium  ${
          isCartPopupPage ? "text-xs 2xl:text-sm" : "text-sm md:text-base"
        }`}
      >
        <p>Lab Created {cartItem.diamondDetail.caratWeight} Carat,&nbsp;</p>
        <p>{cartItem.diamondDetail.shapeName} Diamond,&nbsp;</p>
        <p>Clarity- {cartItem.diamondDetail.clarity},&nbsp;</p>
        <p>Color- {cartItem.diamondDetail.color}</p>
      </div>
    </div>
  );
};

export default DiamondDetailDrawer;
