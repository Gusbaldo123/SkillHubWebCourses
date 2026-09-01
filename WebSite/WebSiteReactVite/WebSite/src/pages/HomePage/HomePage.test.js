// HomePage.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import CourseManager from "../../utils/CourseManager";

// Mock do CourseManager
jest.mock("../../utils/CourseManager", () => ({
  getAll: jest.fn()
}));

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useNavigate: () => mockNavigate
  };
});


describe("HomePage", () => {
  const mockCourses = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    title: `Course ${i}`,
    imageBase64: "fakeimg=="
  }));

  beforeEach(() => {
    CourseManager.getAll.mockResolvedValue({ data: mockCourses });
  });

  it("Must render courses after load", async () => {
    render(<HomePage />, { wrapper: MemoryRouter });

    expect(await screen.findByText("Course 0")).toBeInTheDocument();
    expect(screen.getByText("Course 1")).toBeInTheDocument();
  });

  it("Must filter when clicking search", async () => {
    render(<HomePage />, { wrapper: MemoryRouter });

    await screen.findByText("Course 0");

    fireEvent.change(screen.getByPlaceholderText("What do you want to learn?"), {
      target: { value: "Course 3" }
    });

    fireEvent.click(screen.getByText("Search"));

    const courseSlots = await screen.findAllByText("Course 3");
    expect(courseSlots.length).toBeGreaterThan(0);
    expect(courseSlots[0]).toBeInTheDocument();
    expect(screen.queryByText("Course 0")).not.toBeInTheDocument();
  });

  it("Must show message when no course is found", async () => {
    render(<HomePage />, { wrapper: MemoryRouter });

    await screen.findByText("Course 0");

    fireEvent.change(screen.getByPlaceholderText("What do you want to learn?"), {
      target: { value: "none" }
    });

    fireEvent.click(screen.getByText("Search"));

    expect(await screen.findByText("There are no courses yet")).toBeInTheDocument();
  });

  it("When clicking on course, must redirect to course id", async () => {
    render(<HomePage/>, {wrapper:MemoryRouter});

    fireEvent.click(await screen.findByText("Course 0"));

    expect(useNavigate()).toBeCalledWith("/Course?courseID=0");
  });
});