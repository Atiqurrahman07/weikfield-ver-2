import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
	selectedProduct,
	setProducts,
} from "../../redux/actions/productActions";
import $ from "jquery";

import ProductService from "../../axios/services/api/product";
import PlaceOrderService from "../../axios/services/api/placeOrder";

import { ColorRing } from "react-loader-spinner";
import DashboardService from "../../axios/services/api/dashboard";
import {
	setDashboard,
	setOrderLine,
} from "../../redux/actions/dashboardAction";
import { setMenu } from "../../redux/actions/menuAction";
import { userType } from "../pages/constants/constants";
import Swal from "sweetalert2";
import {
	setOrderDetails,
	setSelectedOrder,
} from "../../redux/actions/placeOrderAction";
import DashBoardModel from "../../components/DashBoard/DashBoardModel";
import DashBoardTiles from "../../components/DashBoard/DashBoardTiles";

const Dashboard = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const products = useSelector((state) => state.allProducts.products);
	const userProfile = useSelector((state) => state.userProfile);
	const menus = useSelector((state) => state.menuData.menuData);

	const dashboard = useSelector((state) => state.dashboard.dashboard);
	const orderLine = useSelector((state) => state.dashboard.orderLine.products);
	const orderNo = useSelector((state) => state.dashboard.orderLine.ord);

	const { alert_details, order_details, dashboard_tiles } = dashboard;

	const [data, setData] = useState([]);
	const productDetails = useSelector(
		(state) => state.allProducts.selectedProduct
	);

	const dispatch = useDispatch();

	useLayoutEffect(() => {
		document.body.classList.remove("loginBG");
		document.body.classList.add(
			"fixed-nav",
			"sticky-footer",
			"sidenav-toggled"
		);
	}, []);

	// const getProduct = async () => {
	// 	setLoading(true);
	// 	await ProductService.getProduct().then((response) => {
	// 		dispatch(setProducts(response));
	// 		setData(response);
	// 		console.log(response);
	// 		setLoading(false);
	// 	});
	// };

	const getOrderLines = async (item) => {
		const { order_no } = item;
		console.log("item ord_no", order_no);
		// AXIOS WRAPPER FOR API CALL
		await DashboardService.getOrderLines(userProfile, order_no).then(
			(response) => {
				dispatch(setOrderLine(response.data.order_line_details, item));
			}
		);
		// AXIOS WRAPPER FOR API CALL
	};

	// const addOrder = async (item) => {
	// 	await ProductService.addOrder(item).then((response) => {
	// 		alert(`New Message with id ${response.id} created!`);
	// 		console.log("submitted!", response);
	// 		// dispatch(selectedProduct(response));
	// 	});
	// };

	const getDashboard = async () => {
		//AXIOS WRAPPER FOR API CALL
		setLoading(true);
		await DashboardService.getDashboardDetails(userProfile).then((response) => {
			dispatch(setDashboard(response.data));
			setLoading(false);
		});
		//AXIOS WRAPPER FOR API CALL
	};

	const setStatus = async (item, id) => {
		console.log(item.order_no);
		let order_no = item.order_no;
		const { value: remark } = await Swal.fire({
			input: "text",
			inputLabel: "Remark",
			inputPlaceholder: "Please Enter Remark",
		});
		if (remark) {
			await DashboardService.setStatus(userProfile, order_no, id, remark).then(
				(response) => {
					console.log("response setStatus", response);
					Swal.fire(response.status);
				}
			);
			getDashboard();
		}
	};

	const getModifyOrder = async (item) => {
		dispatch(setSelectedOrder(item));
		console.log("item", item);
		navigate("/modifyorder");

		// await PlaceOrderService.getModifyOrderDetails({
		// 	userProfile,
		// }).then((response) => {
		// 	dispatch(setOrderDetails(response.data.order_grid_details));
		// 	navigate("/modifyorder");
		// });
	};

	useEffect(() => {
		if (userProfile.usertype !== "null") {
			// getProduct();
			getDashboard();
		} else {
			navigate("/");
		}
	}, [userProfile]);

	return (
		<>
			<Helmet title="Dashboard" />

			{/* <div className="container">
				<div className="row">
					{products &&
						products.map((item, index) => (
							<div
								key={index}
								onClick={() => getProductDetails(item)}
								className="col-6"
								style={{ border: "2px solid #eee", textAlign: "center" }}>
								{item.title}
								<br />
								<img src={item.image} height="120px" width="100px" />
								<h2>
									<a
										href="#vieworderpop"
										data-toggle="modal"
										data-tooltip="tooltip"
										title="View Order">
										2022200001
									</a>
									{item.price}
								</h2>
							</div>
						))}
				</div>
			</div> */}

			<div className="content-wrapper">
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<ol className="breadcrumb">
								<li className="breadcrumb-item">Dashboard</li>
							</ol>
							{alert_details && alert_details.length > 0 && (
								<div className="alert alert-success" role="alert">
									<button
										type="button"
										className="close btn"
										data-dismiss="alert"
										aria-label="Close">
										<span aria-hidden="true">&times;</span>
									</button>
									<h4 className="alert-heading">Alert message heading!</h4>
									<p className="mb-0">
										{alert_details && alert_details.alert_message}
									</p>
								</div>
							)}
							<DashBoardTiles />

							{/* <button
								onClick={
									() => getModifyOrder()
									// navigate("/placeorder")
								}>
								getModifyOrder
							</button> */}
							<div className="card border-0 rounded-0 mb-3">
								<div className="card-body">
									{loading ? (
										<ColorRing
											visible={true}
											height="80"
											width="100%"
											ariaLabel="blocks-loading"
											wrapperStyle={{}}
											wrapperClass="blocks-wrapper"
											colors={[
												"#e15b64",
												"#f47e60",
												"#f8b26a",
												"#abbd81",
												"#849b87",
											]}
										/>
									) : (
										// <h1>Loading...</h1>
										<>
											<p className="font-weight-bold">
												Approval pending:{" "}
												<span className="text-danger">
													{order_details && order_details.length}
												</span>
											</p>
											{order_details && order_details.length > 0 && (
												<div className="table-responsive">
													<table
														className="table table-bordered"
														id="dataTable"
														width="100%"
														cellSpacing="0">
														<thead>
															<tr>
																<th>Order No</th>
																<th>Order Date</th>
																{userProfile &&
																userProfile.usertype.toUpperCase() ===
																	userType.DISTRIBUTOR ? null : (
																	<th>Customer Name</th>
																)}
																{/* <th>Order Qty</th> */}
																<th>Order Amount</th>
																{/* <th>Invoice Qty</th> */}
																{/* <th>Invoice Amount</th> */}
																<th style={{ minWidth: "120px" }}>Status</th>
																{/* <th>ERP Ref No.</th> */}
															</tr>
														</thead>
														{/* <tfoot>
															<tr>
																<th>Order No</th>
																<th>Order Date</th>
																<th>Customer Name</th>
																<th>Order Qty</th>
																<th>Order Amount</th>
																<th>Invoice Qty</th>
																<th>Invoice Amount</th>
																<th>Status</th>
															</tr>
														</tfoot> */}
														<tbody>
															{order_details &&
																order_details.map((item, i) => (
																	<tr key={i}>
																		<td onClick={() => getOrderLines(item)}>
																			{/* <td> */}
																			<a
																				className="text-green"
																				// href="#vieworderpop"
																				href="#dashboardpop"
																				data-toggle="modal"
																				data-tooltip="tooltip"
																				title="View Order">
																				{item.order_no}
																			</a>
																		</td>
																		<td className="text-nowrap">
																			{item.order_date}
																		</td>
																		{userProfile &&
																		userProfile.usertype.toUpperCase() ===
																			userType.DISTRIBUTOR ? null : (
																			<td className="text-nowrap">
																				{item.customer_name}
																			</td>
																		)}

																		<td>
																			{Math.round(item.order_amount * 100) /
																				(100).toFixed(2)}
																		</td>
																		<td>
																			{userProfile &&
																			userProfile.usertype.toUpperCase() ===
																				userType.APPROVER &&
																			// userType.DISTRIBUTOR &&
																			item.ui_status.toUpperCase() ===
																				"Waiting for Approval".toUpperCase() ? (
																				<div>
																					<button
																						// onClick={() => alert(item.order_no)}
																						onClick={() => setStatus(item, 0)}
																						// type="submit"
																						className="btn btn-primary btn-sm mr-2">
																						<i className="fa-solid fa-check"></i>
																					</button>
																					<button
																						// type="reset"
																						onClick={() => setStatus(item, 1)}
																						className="btn btn-danger btn-sm mr-2">
																						<i className="fa-solid fa-xmark"></i>
																					</button>
																					<button
																						data-dismiss="modal"
																						aria-label="Close"
																						className="btn btn-primary btn-sm mr-1"
																						onClick={
																							() => getModifyOrder(item)
																							// navigate("/placeorder")
																						}>
																						<i
																							className="fa-solid fa-pen"
																							aria-hidden="true"></i>
																					</button>
																				</div>
																			) : (
																				<span className="text-danger text-nowrap">
																					{item.ui_status}
																				</span>
																			)}
																		</td>

																		{/* <td>11021</td> */}
																	</tr>
																))}
														</tbody>
														{/* <tbody>
													{products.map((item, index) => (
														<tr key={index}>
															<td>
																<a
																	href="#vieworderpop"
																	data-toggle="modal"
																	data-tooltip="tooltip"
																	title="View Order">
																	{item.id}
																</a>
															</td>
															<td>08/02/2022</td>
															<td>Gautam Foods</td>
															<td>11</td>
															<td>25257.25</td>
															<td>5</td>
															<td>25257.25</td>
															<td>Waiting for approval</td>
															<td>11021</td>
														</tr>
													))}
												</tbody> */}
													</table>
												</div>
											)}
										</>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* {console.log("public url: ", process.env.PUBLIC_URL)} */}

			<DashBoardModel id="dashboardpop" />
		</>
	);
};

export default Dashboard;
