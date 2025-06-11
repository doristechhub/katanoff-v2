const DiamondDetailDrawer = ({ cartItem }) => {
  if (!cartItem?.diamondDetail) return null;

  return (
    <div className="mt-1">
      <h4 className="font-semibold text-sm md:text-base">Your Diamond</h4>

      <div className="flex flex-wrap">
        <p className="   text-sm  text-baseblack">
          Lab Created {cartItem.diamondDetail.caratWeight} Carat,&nbsp;
        </p>
        <p className="   text-sm  text-baseblack">
          {cartItem.diamondDetail.shapeName} Diamond,&nbsp;
        </p>
        <p className="   text-sm  text-baseblack">
          Clarity- {cartItem.diamondDetail.clarity},&nbsp;
        </p>
        <p className="   text-sm  text-baseblack">
          Color- {cartItem.diamondDetail.color}
        </p>
      </div>
    </div>
  );
};

export default DiamondDetailDrawer;
