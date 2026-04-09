import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ListingForm from "../../components/ListingForm";

const SERVER = import.meta.env.VITE_SERVER_URL;

const EditListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await axios.get(`${SERVER}/api/listings/${id}`);
      setListing(res.data.listing);
    };

    fetchListing();
  }, [id]);

  if (!listing) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Edit Listing</h2>
      <ListingForm editData={listing} listingId={id} />
    </div>
  );
};

export default EditListing;