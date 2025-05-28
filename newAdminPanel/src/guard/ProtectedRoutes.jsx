import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { helperFunctions } from '../_helpers';

const ProtectedRoutes = ({ children, pageId }) => {
  const currentUser = helperFunctions.getCurrentUser();

  let { adminWisePermisisons } = useSelector(({ admin }) => admin);
  if (!currentUser) {
    return <Navigate to="/login" replace={true} />;
  } else {
    return helperFunctions.checkUserPermission(adminWisePermisisons, pageId) ? (
      children
    ) : (
      <Navigate to="/unAuthorized" replace={true} />
    );
  }
};

export default ProtectedRoutes;
