import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2"; // Import SweetAlert2
import ScreenHeader from "../../components/ScreenHeader";
import Wrapper from "./Wrapper";
import { clearMessage, setSuccess } from "../../store/reducers/globalReducer";
import {
  useGetQuery,
  useDeleteCategoryMutation,
} from "../../store/services/categoryService";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";

const Categories = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }

  const navigate = useNavigate(); // Initialize navigation hook

  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();
  const { data = [], isFetching } = useGetQuery(page);
  const [removeCategory, response] = useDeleteCategoryMutation();

  // SweetAlert for Delete Category
  const deleteCat = (id) => {
    Swal.fire({
      title: "Delete Category?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        cancelButton:
          "bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        popup: "bg-gray-900 text-white border border-gray-700 rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        removeCategory(id);
        Swal.fire({
          title: "Deleted!",
          text: "Category has been deleted.",
          icon: "success",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all",
            popup: "bg-gray-900 text-white border border-gray-700 rounded-xl",
          },
        });
      }
    });
  };

  // SweetAlert for Edit Category
  const handleEdit = (id) => {
    Swal.fire({
      title: "Edit Category?",
      text: "You are about to modify this category.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, edit it!",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        cancelButton:
          "bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-5 rounded-lg mx-2 transition-all",
        popup: "bg-gray-900 text-white border border-gray-700 rounded-xl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/dashboard/update-category/${id}`);
      }
    });
  };

  useEffect(() => {
    if (response.isSuccess) {
      dispatch(setSuccess(response?.data?.message));
    }
  }, [response?.data?.message, response.isSuccess, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearMessage());
    };
  }, [dispatch]);

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/dashboard/create-category" className="btn-dark">
          add categories <i className="bi bi-plus"></i>
        </Link>
      </ScreenHeader>
      {success && <div className="alert-success">{success}</div>}
      {!isFetching ? (
        data?.categories?.length > 0 && (
          <>
            <div>
              <table className="w-full bg-gray-900 rounded-md">
                <thead>
                  <tr className="border-b border-gray-800 text-left">
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      name
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      edit
                    </th>
                    <th className="p-3 uppercase text-sm font-medium text-gray-500">
                      delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.categories?.map((category) => (
                    <tr key={category._id} className="odd:bg-gray-800">
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        {category.name}
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <button
                          className="btn btn-warning"
                          onClick={() => handleEdit(category._id)}
                        >
                          edit
                        </button>
                      </td>
                      <td className="p-3 capitalize text-sm font-normal text-gray-400">
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteCat(category._id)}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path="dashboard/categories"
            />
          </>
        )
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};
export default Categories;
