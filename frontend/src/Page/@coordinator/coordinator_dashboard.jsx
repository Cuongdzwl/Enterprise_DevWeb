import React from 'react';
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import useFetch from "../../CustomHooks/useFetch.jsx";
import {ApiResponse} from "../../Api.js";
import Loading from "../../components/Loading.jsx";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";


const CoordinatorDashBoard = () => {
    const {data: dataSource} = useFetch(`${ApiResponse}faculties/1/dashboard?startYear=2023&endYear=2024`);

    if (!dataSource) {
        return <Loading/>
    }

    // Year unique Array
    const uniqueYears = [...new Set(dataSource.map(data => data.year))];

    // Faculty from Current User
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const facultyID = currentUser.FacultyID;


    // Data for Bar Chart
    const numsContributionOfFaculity = uniqueYears.map(year => ({
        label: year.toString(),
        backgroundColor: year === 2023 ? "rgba(43, 63, 229, 0.8)" : "rgba(250, 192, 19, 0.8)",
        data: dataSource.filter(data => (data.year === year) && (data.facultyID === facultyID)).map(data => data.contributionsOfFaculty)
    }));

    const numsContributorsOfFaculty = uniqueYears.map(year => ({
        label: year.toString(),
        backgroundColor: year === 2023 ? "rgba(43, 63, 229, 0.8)" : "rgba(250, 192, 19, 0.8)",
            data: dataSource.filter(data => (data.year === year) && (data.facultyID === facultyID)).map(data => data.contributorsOfFaculty)
    }));



    return (
        <>
            <div className='box'>
                <div className="row-1">
                    <div className="header">
                        <div className="title">Coordinator Dashboard</div>
                    </div>
                </div>

                <div className="dashboard coodinator">
                    <div className="dataCard customerCard">
                        <Bar
                            data={{
                                labels: [...new Set(dataSource.filter(data => data.facultyID === facultyID).map(data => data.facultyName))],
                                datasets: numsContributionOfFaculity
                            }}
                            options={{
                                plugins: {
                                    title: {
                                        text: "Faculty Contribution",
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="dataCard categoryCard">
                        <Bar
                            data={{
                                labels: [...new Set(dataSource.filter(data => data.facultyID === facultyID).map(data => data.facultyName))],
                                datasets: numsContributorsOfFaculty
                            }}
                            options={{
                                plugins: {
                                    title: {
                                        text: "Number of Contributors",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CoordinatorDashBoard;