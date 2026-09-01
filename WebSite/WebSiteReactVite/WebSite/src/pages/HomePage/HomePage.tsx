//#region imports
import React, { useEffect, useState, type SetStateAction } from "react";
import { useNavigate } from "react-router";

import "./HomePage.css";
import "./HomeMobilePage.css";

import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Banner from "../../components/shared/Banner";

import CourseManager from "../../utils/CourseManager";

export default HomePage;

//#endregion

//#region Handlers
const NextCourse = (setCurrentIndex:any, courseList:any) => {
  setCurrentIndex((prevIndex:any) => (prevIndex + 1) % courseList.length);
};

const PreviousCourse = (setCurrentIndex:any, courseList:any) => {
  setCurrentIndex((prevIndex:any) => (prevIndex - 1 + courseList.length) % courseList.length);
};

function FilterCarroussel(filter:string, courseList:number[], setFilteredCourseList:(courses:number[]) => SetStateAction<number[]>)
{
  if(!filter || filter === "")
  {
    setFilteredCourseList(courseList);
    return;
  }

  var newList = [...courseList];
  newList = newList.filter((course:any)=>ClearText(course.title).includes(ClearText(filter)));
  setFilteredCourseList(newList);
}

const ClearText = (text:string) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/ç/g, "c").replaceAll(/Ç/g, "C").replaceAll("%20"," ").toLowerCase();
};
//#endregion

//#region JSX

function CarrousselCourses({ courseList, navigate }:{ courseList:any[]|null, navigate:any }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      if (width < 600) setVisibleCount(1);
      else if (width < 1280) setVisibleCount(3);
      else setVisibleCount(5);
    }

    handleResize(); // define no primeiro render
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!courseList || courseList.length === 0) {
    return (
      <div className="carouselWrapper">
        <h2 className="emptyCourses">There are no courses yet</h2>
      </div>
    );
  }

  const visibleItems = Array.from({ length: visibleCount }, (_, i) =>
    courseList[(currentIndex + i) % courseList.length]
  );

  function Wrapper({ visibleItems, navigate }: { visibleItems: any[], navigate: any }) {
    if (visibleItems.includes(undefined))
      return (
        <div className="carouselWrapper">
          <h2 className="emptyCourses">There are no courses yet</h2>
        </div>
      );

    return (
      <div className="carouselWrapper">
        {visibleItems.map((course, i) =>
          course ? (
            <div
              key={i}
              className="course fade"
              onClick={() => navigate(`/Course?courseID=${course.id}`)}
            >
              <img
                src={`data:image/png;base64,${course.imageBase64}`}
                alt={`course${i}`}
              />
              <div className="courseName">{course.title}</div>
            </div>
          ) : null
        )}
      </div>
    );
  }

  return (
    <div className="contentCourseCaroussel">
      <button
        onClick={() => PreviousCourse(setCurrentIndex, courseList)}
        className="contentCoursePrevious btCourses"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 4l8 8-8 8" />
        </svg>
      </button>
      <Wrapper visibleItems={visibleItems} navigate={navigate} />
      <button
        onClick={() => NextCourse(setCurrentIndex, courseList)}
        className="contentCourseNext btCourses"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 4l8 8-8 8" />
        </svg>
      </button>
    </div>
  );
}

function HomePage() {

  const [courseList, setCourseList] = useState(null);
  const [filteredCourseList, setFilteredCourseList] = useState(null);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Skillhub";

    const loadCourses = async () => {
      const res = await CourseManager.getAll();
      if (!res) return;
      setCourseList(res.data);
      setFilteredCourseList(res.data);
    };

    loadCourses();
  }, []);

  if (!courseList)
    return <div className="homepage-loading">Loading...</div>;
  
  return (
    <>
      <Header />
      <main>
        <Banner />
        <section className="content">
          <div className="contentCourseSearch">
            <input type="text" id="contentCourseText" className="contentCourseText" placeholder="What do you want to learn?" onChange={(e)=>setFilter(e.target.value)}/>
            <button onClick={()=>{FilterCarroussel(filter,courseList,setFilteredCourseList)}}>Search</button>
          </div>
          <CarrousselCourses courseList={filteredCourseList} navigate={navigate} />
        </section>
      </main>
      <Footer />
    </>
  );
}
//#endregion
