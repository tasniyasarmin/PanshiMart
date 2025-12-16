import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { clearMessage } from "../../store/reducers/globalReducer";
import Wrapper from "./Wrapper";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../store/services/productService";
import ScreenHeader from "../../components/ScreenHeader";
import Spinner from "../../components/Spinner";
import Pagination from "../../components/Pagination";
import AppImage from "../../components/common/AppImage";
import Swal from "sweetalert2"; // Import SweetAlert2

const Products = () => {
  let { page } = useParams();
  if (!page) {
    page = 1;
  }

  const navigate = useNavigate(); // Initialize navigation hook

  const { data = [], isFetching } = useGetProductsQuery(page);
  const { success } = useSelector((state) => state.globalReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    if (success) {
      toast.success(success);
    }
    return () => {
      dispatch(clearMessage());
    };
  }, [success, dispatch]);

  const [delProduct] = useDeleteProductMutation();

  // SweetAlert for Delete Product
  const deleteProduct = (id) => {
    Swal.fire({
      title: "Delete Product?",
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
        delProduct(id);
        Swal.fire({
          title: "Deleted!",
          text: "Product has been deleted.",
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

  // SweetAlert for Edit Product
  const handleEdit = (id) => {
    Swal.fire({
      title: "Edit Product?",
      text: "You are about to modify this product's details.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, edit product!",
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
        navigate(`/dashboard/edit-product/${id}`);
      }
    });
  };

  return (
    <Wrapper>
      <ScreenHeader>
        <Link to="/dashboard/create-product" className="btn-dark">
          create product
        </Link>
        <Toaster position="top-right" />
      </ScreenHeader>
      {!isFetching ? (
        data?.products?.length > 0 ? (
          <div>
            <table className="w-full bg-gray-900 rounded-md">
              <thead>
                <tr className="border-b border-gray-800 text-left">
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    name
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    price
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    stock
                  </th>
                  <th className="p-3 uppercase text-sm font-medium text-gray-500">
                    image
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
                {data?.products?.map((product) => (
                  <tr className="odd:bg-gray-800" key={product._id}>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      {product.title}
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      ${product.price}.00
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      {product.stock}
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      <AppImage
                        src={product.image1}
                        alt={product.title}
                        className="w-20 h-20 rounded-md object-cover"
                      />
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      {/* Edit Button Trigger */}
                      <button
                        onClick={() => handleEdit(product._id)}
                        className="btn btn-warning cursor-pointer"
                      >
                        edit
                      </button>
                    </td>
                    <td className="p-3 capitalize text-sm font-normal text-gray-400">
                      {/* Delete Button Trigger */}
                      <span
                        className="btn btn-danger cursor-pointer"
                        onClick={() => deleteProduct(product._id)}
                      >
                        delete
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination
              page={parseInt(page)}
              perPage={data.perPage}
              count={data.count}
              path="dashboard/products"
            />
          </div>
        ) : (
          "No products!"
        )
      ) : (
        <Spinner />
      )}
    </Wrapper>
  );
};

export default Products;
