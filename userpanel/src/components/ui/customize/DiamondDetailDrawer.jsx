const DiamondDetailDrawer = ({ cartItem }) => {
  if (!cartItem?.diamondDetail) return null;

  return (
    <div className="mt-2">
      <h4 className="font-semibold text-sm md:text-base">Your Diamond</h4>

      <div className="flex flex-wrap">
        <p className=" font-medium text-sm md:text-base text-baseblack">
          Lab Created {cartItem.diamondDetail.caratWeight} Carat,&nbsp;
        </p>
        <p className=" font-medium text-sm md:text-base text-baseblack">
          {cartItem.diamondDetail.shapeName} Diamond
        </p>
        <p className=" font-medium text-sm md:text-base text-baseblack">
          Clarity- {cartItem.diamondDetail.clarity},&nbsp;
        </p>
        <p className=" font-medium text-sm md:text-base text-baseblack">
          Color- {cartItem.diamondDetail.color}
        </p>
      </div>
    </div>
  );
};

export default DiamondDetailDrawer;
