import React from 'react';
import {Chart as ChartJS, defaults} from "chart.js/auto";
import {Bar, Doughnut, Line} from 'react-chartjs-2';
import useFetch from '../../CustomHooks/useFetch'
import {ApiResponse} from "../../Api.js";
import Loading from "../../components/Loading.jsx";


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";


const AdminDashboard = () => {
    const {data: dataSource} = useFetch(`${ApiResponse}faculties/1/dashboard?startYear=2023&endYear=2024`);

    if (!dataSource) {
        return <Loading/>
    }

    // Year unique Array
    const uniqueYears = [...new Set(dataSource.map(data => data.year))];

    // Data for Bar Chart
    const numsContributionOfFaculity = uniqueYears.map(year => ({
        label: year.toString(),
        backgroundColor: year === 2023 ? "rgba(43, 63, 229, 0.8)" : "rgba(250, 192, 19, 0.8)",
        data: dataSource.filter(data => data.year === year).map(data => data.contributionsOfFaculty)
    }));

    const numsContributionsException = uniqueYears.map(year => ({
        label: year.toString(),
        backgroundColor: year === 2023 ? "rgba(43, 63, 229, 0.8)" : "rgba(250, 192, 19, 0.8)",
        data: dataSource.filter(data => data.year === year).map(data => data.contributionsException)
    }));


    // Data for Pie Chart
    const aggregatedData = {};
    dataSource.forEach(item => {
        const key = item.facultyName;
        const percentage = item.contributionsPercentage;
        if (!aggregatedData[key]) {
            aggregatedData[key] = percentage;
        } else {
            aggregatedData[key] += percentage;
        }
    });

    const aggregatedArray = Object.entries(aggregatedData).map(([facultyName, contributionsPercentage]) => ({
        facultyName,
        contributionsPercentage
    }));


    return (
        <>
            <div className='box'>
                <div className="row-1">
                    <div className="header">
                        <div className="title">Admin Dashboard</div>
                    </div>
                </div>

                <div className="dashboard">
                    <div className="dataCard revenueCard">
                        <Bar
                            data={{
                                labels: [...new Set(dataSource.map(data => data.facultyName))],
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

                    <div className="dataCard customerCard">
                        <Bar
                            data={{
                                labels: [...new Set(dataSource.map(data => data.facultyName))],
                                datasets: numsContributionsException
                            }}
                            options={{
                                plugins: {
                                    title: {
                                        text: "Exception Contribution",
                                    },
                                },
                            }}
                        />
                    </div>

                    <div className="dataCard categoryCard">
                        <Doughnut
                            data={{
                                labels: aggregatedArray.map((data) => data.facultyName),
                                datasets: [
                                    {
                                        label: "Count",
                                        data: aggregatedArray.map((data) => data.contributionsPercentage),
                                        backgroundColor: [
                                            "rgba(43, 63, 229, 0.8)",
                                            "rgba(250, 192, 19, 0.8)",
                                            "rgba(253, 135, 135, 0.8)",
                                        ],
                                        borderColor: [
                                            "rgba(43, 63, 229, 0.8)",
                                            "rgba(250, 192, 19, 0.8)",
                                            "rgba(253, 135, 135, 0.8)",
                                        ],
                                    },
                                ],
                            }}
                            options={{
                                plugins: {
                                    title: {
                                        text: "Percent Contribution",
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

export default AdminDashboard;