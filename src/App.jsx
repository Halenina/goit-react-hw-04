import { useState, useEffect } from "react";
import "./App.css";
import SearchBar from "./components/SearchBar/SearchBar";
import ImageGallery from "./components/ImageGallery/ImageGallery";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import Loader from "./components/Loader/Loader";
import { fetchImages } from "./api";
import ImageModal from "./components/ImageModal/ImageModal";
import LoadMoreBtn from "./components/LoadMoreBtn/LoadMoreBtn";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showButton, setShowButton] = useState(false);

  const buttonRef = useRef(null);

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    setImages([]);
  };

  useEffect(() => {
    if (query === "") {
      return;
    }

    async function getImages() {
      try {
        setError(false);
        setIsLoading(true);
        const data = await fetchImages(query, page);
        if (data.length === 0) {
          toast.error("No images!");
        } else {
          setImages((prevArticles) => {
            return [...prevArticles, ...data];
          });
        }
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    getImages();
  }, [page, query]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  const openModal = (image) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (images.length <= 12) {
      return;
    }
    if (buttonRef.current) {
      const loadMoreScroll = buttonRef.current.getBoundingClientRect();
      window.scrollTo({
        top: window.scrollY + loadMoreScroll.top,
        behavior: "smooth",
      });
    }
  }, [images]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleScroll = () => {
    const scrolled = window.scrollY;
    setShowButton(scrolled > 0);
  };

  useEffect(() => {
    window.onscroll = handleScroll;
    return () => (window.onscroll = null);
  }, []);

  return (
    <div className={css.container}>
      <SearchBar onSubmit={handleSearch} />
      {error && <ErrorMassage />}
      {images.length > 0 && <ImageGallery onOpen={openModal} images={images} />}
      {isLoading && <Loader />}
      {images.length > 0 && !isLoading && (
        <LoadMorebutton loadMore={handleLoadMore} onRef={buttonRef} />
      )}
      <ImageModal
        openModal={modalIsOpen}
        onClose={closeModal}
        selectedImage={selectedImage}
      />
      <Toaster position="top-right" reverseOrder={false} />
      {showButton && <ScrollButton scrollToTop={scrollToTop} />}
    </div>
  );
}