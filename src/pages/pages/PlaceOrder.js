import React, {
	Component,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { json, useNavigate } from "react-router-dom";
import PlaceOrderService from "../../axios/services/api/placeOrder";
import {
	setAddToCart,
	setFlavour,
	setOrderDetails,
	setOrderFilter,
	setProductLine,
} from "../../redux/actions/placeOrderAction";

import {
	addProduct,
	selectedProduct,
} from "../../redux/actions/productActions";

import $ from "jquery";
import { ColorRing } from "react-loader-spinner";
import { getUniqueByKey } from "./utils/findUniqueBykey";

const PlaceOrder = (props) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const containerRef = useRef(null);
	const inputRef1 = useRef(null);

	const userProfile = useSelector((state) => state.userProfile);
	const orderFilter = useSelector((state) => state.placeOrder.orderFilter);
	const orderDetails = useSelector((state) => state.placeOrder.orderDetails);
	const productLine = useSelector((state) => state.placeOrder.productLine);
	const flavour = useSelector((state) => state.placeOrder.flavour);
	const placeOrder = useSelector((state) => state.placeOrder);

	const { flavour_details } = flavour;
	const { product_line_details } = productLine;
	const { distributor_details, brand_details, pack_type_details } = orderFilter;
	const { order_grid_details } = orderDetails;
	const { addTocart } = placeOrder;

	let cartTotal = 0;
	let cartTotalQty = 0;
	let addToCartTotal = 0;
	let addToCartQty = 0;
	const [input, setInput] = useState([]);
	const productData = {
		order_grid_details: [
			{
				customer_type: "Consumer",
				item_promo_flag: "Y",
				flavour: "Chocolate",
				sit_inventory_qty: "0",
				erp_commited_qty: "0",
				portal_reg_promo_flag: "Y",
				product_line: "Cooker Cake Mix",
				uom: "Case",
				portal_mrp: "3300.0",
				portal_item_desc: "WEIKFIELD-COOKER CAKE MIX-CHOCOLATE-PKT-30X150gm",
				units_per_case: "30",
				parent_code: "FG-8113021",
				physical_inventory_qty: "89",
				portal_billing_price: "2504.55",
				portal_item_code: "PFG-8113021",
				sap_block_flag: "0",
				brand: "Weikfield",
			},
			{
				customer_type: "Consumer",
				item_promo_flag: "N",
				flavour: "Creamy Mushroom",
				sit_inventory_qty: "0",
				erp_commited_qty: "5",
				portal_reg_promo_flag: "N",
				product_line: "Instant Pasta",
				uom: "Case",
				portal_mrp: "3360.0",
				portal_item_desc: "WEIKFIELD-PASTA-PENNE-POUCH-48X200gm",
				units_per_case: "48",
				parent_code: "FG-8111002",
				physical_inventory_qty: "87",
				portal_billing_price: "2550.09",
				portal_item_code: "RFG-8111002",
				sap_block_flag: "0",
				brand: "Weikfield",
			},
			{
				customer_type: "Consumer",
				item_promo_flag: "Y",
				flavour: "Creamy Mushroom",
				sit_inventory_qty: "0",
				erp_commited_qty: "0",
				portal_reg_promo_flag: "N",
				product_line: "Instant Pasta",
				uom: "Case",
				portal_mrp: "3600.0",
				portal_item_desc: "WEIKFIELD-PASTA-PENNE-POUCH-24X400gm",
				units_per_case: "24",
				parent_code: "FG-8111003",
				physical_inventory_qty: "99",
				portal_billing_price: "2732.24",
				portal_item_code: "RFG-8111003",
				sap_block_flag: "0",
				brand: "Weikfield",
			},
		],
	};

	const [orderData, setOrderData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [selectedBrand, setSelectedBrand] = useState(null);
	const [selectedFlavour, setSelectedFlavour] = useState(null);
	const [selectedProductLine, setSelectedProductLine] = useState(null);
	const [selectedPackType, setSelectedPackType] = useState(null);

	const [disableFilter, setDisableFilter] = useState(true);
	const [disableAddToCart, setDisableAddToCart] = useState(true);

	const getOrderFilters = async () => {
		//AXIOS WRAPPER FOR API CALL
		await PlaceOrderService.getOrderFilters(userProfile).then((response) => {
			dispatch(setOrderFilter(response.data));
		});
		//AXIOS WRAPPER FOR API CALL
	};

	const getOrderDetails = async (data) => {
		// AXIOS WRAPPER FOR API CALL
		{
			data !== null && data.customer_block_flag === "YES" ? (
				<>
					{await PlaceOrderService.getOrderDetails({ userProfile, data }).then(
						(response) => {
							dispatch(setOrderDetails(response.data));
							setDisableFilter(false);
						}
					)}
				</>
			) : (
				<>{(setDisableFilter(true), alert("Not Applicable"))}</>
			);
		}

		// dispatch(setOrderDetails(productData));
		// setDisableFilter(false);

		// AXIOS WRAPPER FOR API CALL
	};

	const getProductLine = async (brand) => {
		// AXIOS WRAPPER FOR API CALL
		setSelectedBrand(brand);
		dispatch(setFlavour("null"));
		dispatch(setProductLine("null"));
		await PlaceOrderService.getProductLine({ userProfile, brand }).then(
			(response) => {
				dispatch(setProductLine(response.data));
			}
		);
		// AXIOS WRAPPER FOR API CALL
	};
	useLayoutEffect(() => {
		document.body.classList.remove("loginBG");
		document.body.classList.add(
			"fixed-nav",
			"sticky-footer",
			"sidenav-toggled"
		);
	}, []);

	const getFlavour = async (productLine) => {
		// AXIOS WRAPPER FOR API CALL
		setSelectedProductLine(productLine);
		await PlaceOrderService.getFlavour({
			userProfile,
			selectedBrand,
			productLine,
		}).then((response) => {
			dispatch(setFlavour(response.data));
		});
		// AXIOS WRAPPER FOR API CALL
	};

	useEffect(() => {
		$("table > tbody > tr").hide().slice(0, 10).show();
		$(".show-all").on("click", function () {
			$("tbody > tr", $(this).prev()).show();
		});
	}, [disableFilter]);

	const showFilterData = async (e) => {
		e.preventDefault();
		// const key = "portal_item_code";
		// const order_grid_details_UniqueByKey = getUniqueByKey(
		// 	order_grid_details,
		// 	key
		// );

		let filterData = order_grid_details.filter(function (el) {
			return (
				el.brand === selectedBrand.brand_desc &&
				el.product_line === selectedProductLine.product_line_desc &&
				el.flavour === selectedFlavour.flavour_desc
			);
		});
		if (addTocart.length > 0) {
			filterData = filterData.filter(
				({ portal_item_code: id1 }) =>
					!addTocart.some(({ portal_item_code: id2 }) => id2 === id1)
			);
		}
		setLoading(true);
		setOrderData(() => filterData);
		setDisableFilter(true);
		setLoading(false);
	};

	useEffect(() => {
		if (userProfile.usertype !== "null") {
			getOrderFilters();
		} else {
			navigate("/");
		}
	}, []);

	const addToCart = () => {
		let currItemList = orderData.filter(function (el) {
			return el.sit_inventory_qty >= 1;
		});

		if (addTocart.length > 0) {
			let res = Array.prototype.push.apply(addTocart, currItemList);

			console.log("res", res);
			// console.log("currItemList", currItemList);
			// console.log("addTocart", addTocart);
		}

		console.log("currItemList", currItemList);

		dispatch(setAddToCart(currItemList));

		setOrderData(() =>
			orderData.filter(function (el) {
				return el.sit_inventory_qty == 0;
			})
		);
	};

	const removeFromCart = (e, id) => {
		// setAddToCart((orderData) => {
		id.sit_inventory_qty = 0;
		dispatch(
			setAddToCart(
				addTocart.filter(
					(item, i) => item.portal_item_code !== id.portal_item_code
				)
			)
		);

		{
			selectedBrand &&
				selectedProductLine &&
				selectedFlavour &&
				setOrderData(() =>
					order_grid_details.filter(function (el) {
						return (
							el.brand === selectedBrand.brand_desc &&
							el.product_line === selectedProductLine.product_line_desc &&
							el.flavour === selectedFlavour.flavour_desc
						);
					})
				);
		}

		// });
	};

	const handleQty = (e, id) => {
		// inputRef1.current.value = e.target.value;
		setOrderData((orderData) =>
			orderData.map((item) =>
				id === item.portal_item_code
					? { ...item, sit_inventory_qty: e.target.value }
					: item
			)
		);
		setDisableAddToCart(false);
	};

	const handleQtyInCart = (e, id) => {
		// inputRef1.current.value = e.target.value;
		dispatch(
			setAddToCart(
				addTocart.map((item) =>
					id === item.portal_item_code
						? { ...item, sit_inventory_qty: e.target.value }
						: item
				)
			)
		);
		// setDisableAddToCart(false);
	};

	return (
		<>
			<div className="content-wrapper" ref={containerRef}>
				<div className="container-fluid">
					<div className="row">
						<div className="col-md-12">
							<ol className="breadcrumb">
								<li className="breadcrumb-item">
									{" "}
									<a href="Dashboard.html">Dashboard</a>{" "}
								</li>
								<li className="breadcrumb-item active">Place Order</li>
							</ol>
						</div>
					</div>
					<div className="row">
						<div
							className="col-md-8 collapse show"
							id="collapseAll"
							aria-expanded="true">
							{/* <div className="col-md-8"> */}
							<div className="row mb-3">
								<div className="col-lg-12">
									<div className="card card-primary border-0">
										<div
											className="card-header collapsepanel"
											data-toggle="collapse"
											data-target="#collapseOne"
											aria-expanded="true">
											Search Products
										</div>
										<div
											className="card-body collapse show py-0"
											id="collapseOne"
											aria-expanded="true">
											<div className="column pt-3 col-sm-offset-0">
												<form
													data-toggle="validator"
													role="form"
													className="form-horizontal">
													<div className="form-group row">
														<div className="col-md-6">
															<div className="row">
																<div className="col-md-4">
																	<label
																		htmlFor="Distributor"
																		className="control-label">
																		Distributor:
																	</label>
																</div>
																<div className="col-md-8">
																	<select
																		name="Distributor"
																		className="form-control"
																		data-live-search="true"
																		onChange={(e) =>
																			getOrderDetails(
																				JSON.parse(e.target.value)
																			)
																		}
																		required>
																		<option value="null">Show All</option>
																		{distributor_details &&
																			distributor_details.map((data, index) => (
																				<option
																					key={index}
																					value={JSON.stringify(data)}>
																					{data.customer_name}
																				</option>
																			))}
																	</select>
																</div>
															</div>
														</div>
														<div className="col-md-6">
															<div className="row">
																<div className="col-md-4">
																	<label
																		htmlFor="SalePerson"
																		className="control-label">
																		Sale Person:
																	</label>
																</div>
																<div className="col-md-8">
																	<input
																		type="text"
																		name="SalePerson"
																		className="form-control"
																		defaultValue="Subhadeep Sen"
																		readOnly={true}
																	/>
																</div>
															</div>
														</div>
													</div>
													<div className="form-group row">
														<div className="col-md-6">
															<div className="row">
																<div className="col-md-4">
																	<label
																		htmlFor="SalePerson"
																		className="control-label">
																		Pack Type:
																	</label>
																</div>
																<div className="col-md-8">
																	<div className="lbl-radio-group d-flex">
																		{pack_type_details &&
																			pack_type_details.map(
																				(packType, index) => (
																					<div
																						className="lbl-radio-btn flex-fill"
																						key={packType.pack_type_code}>
																						<input
																							disabled={disableFilter}
																							type="radio"
																							value={JSON.stringify(packType)}
																							id={packType.pack_type_code}
																							name="Pro-type"
																							onChange={(e) =>
																								setSelectedPackType(
																									JSON.parse(e.target.value)
																								)
																							}
																						/>
																						<label
																							htmlFor={packType.pack_type_code}>
																							{packType.pack_type_desc}
																						</label>
																					</div>
																				)
																			)}
																	</div>
																</div>
															</div>
														</div>
														<div className="col-md-6">
															<div className="row">
																<div className="col-md-4">
																	<label
																		htmlFor="ProductFamily"
																		className="control-label">
																		Brand:
																	</label>
																</div>
																<div className="col-md-8">
																	<select
																		name="ProductFamily"
																		className="form-control d-none d-sm-block"
																		data-live-search="true"
																		disabled={disableFilter}
																		onChange={(e) =>
																			// getProductLine(e.target.value)
																			getProductLine(JSON.parse(e.target.value))
																		}
																		required>
																		<option>Show All</option>

																		{brand_details &&
																			brand_details.map((brand, index) => (
																				<option
																					key={brand.brand_code}
																					// value={brand.brand_code}
																					value={JSON.stringify(brand)}>
																					{brand.brand_desc}
																				</option>
																			))}
																	</select>
																	<div className="lbl-radio-group hrl-scrl-rdo d-block d-sm-none">
																		{loading ? (
																			<label>show all</label>
																		) : (
																			<>
																				{brand_details &&
																					brand_details.map((brand, index) => (
																						<div
																							className="lbl-radio-btn"
																							key={brand.brand_code}>
																							<input
																								disabled={disableFilter}
																								type="radio"
																								value={JSON.stringify(brand)}
																								id={brand.brand_code}
																								name="brandRdoGrp"
																								onChange={(e) =>
																									getProductLine(
																										JSON.parse(e.target.value)
																									)
																								}
																							/>
																							<label htmlFor={brand.brand_code}>
																								{brand.brand_desc}
																							</label>
																						</div>
																					))}
																			</>
																		)}
																	</div>
																</div>
															</div>
														</div>
													</div>
													<div className="form-group row">
														<div className="col-md-6">
															<div className="row">
																<div className="col-md-4">
																	<label
																		htmlFor="ProductClass"
																		className="control-label">
																		Product Line:
																	</label>
																</div>
																<div className="col-md-8">
																	<select
																		name="ProductClass"
																		className="form-control"
																		data-live-search="true"
																		disabled={disableFilter}
																		onChange={(e) =>
																			getFlavour(JSON.parse(e.target.value))
																		}
																		required>
																		<option>Show All</option>

																		{product_line_details &&
																			product_line_details.map(
																				(product, index) => (
																					<option
																						key={product.product_line_code}
																						value={JSON.stringify(product)}>
																						{product.product_line_desc}
																					</option>
																				)
																			)}
																	</select>
																</div>
															</div>
														</div>
														<div className="col-md-6">
															<div className="row">
																<div className="col-md-4">
																	<label
																		htmlFor="ProductClass"
																		className="control-label">
																		Flavour:
																	</label>
																</div>
																<div className="col-md-8">
																	<select
																		name="ProductClass"
																		className="form-control"
																		data-live-search="true"
																		disabled={disableFilter}
																		onChange={(e) =>
																			setSelectedFlavour(
																				JSON.parse(e.target.value)
																			)
																		}
																		required>
																		<option>Show All</option>
																		{flavour_details &&
																			flavour_details.map((flavour, index) => (
																				<option
																					key={flavour.flavour_code}
																					value={JSON.stringify(flavour)}>
																					{flavour.flavour_desc}
																				</option>
																			))}
																	</select>
																</div>
															</div>
														</div>
													</div>
													<div className="form-group row">
														<div className="col-md-10"></div>
														<div className="col-md-2">
															{/* <button className="form-control"> */}

															<button
																disabled={disableFilter}
																type="button"
																onClick={(e) => showFilterData(e)}
																className="btn btn-block btn-primary btn-md">
																<i className="fas fa fa-search mr-2"></i> Search
															</button>
														</div>
													</div>
												</form>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="card border-0 rounded-0 mb-3">
								<div className="card-body">
									<div className="table-responsive d-none d-sm-block">
										<table
											className="table table-bordered"
											id="dataTable1"
											width="100%"
											cellSpacing="0">
											<thead>
												<tr>
													<th>Parent Code</th>
													<th>Parent Code Desc</th>
													<th>BO Qty</th>
													<th>W/H Stock</th>
													<th>Price</th>
													<th>UOM</th>
													<th>Qty</th>
													<th>Total Amount</th>
												</tr>
											</thead>
											<tbody>
												{loading ? (
													<ColorRing
														visible={true}
														height="80"
														width="100%"
														ariaLabel="blocks-loading"
														wrapperStyle={{ textAlign: "center" }}
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
													<>
														{orderData.map(
															(item, index) => (
																(cartTotalQty =
																	cartTotalQty + item.sit_inventory_qty),
																(cartTotal +=
																	item.portal_mrp * item.sit_inventory_qty),
																(
																	<tr key={index}>
																		<td>{item.portal_item_code}</td>
																		<td>{item.portal_item_desc}</td>
																		<td>{item.erp_commited_qty}</td>
																		<td>{item.physical_inventory_qty}</td>
																		<td>{item.portal_mrp}</td>
																		<td>{item.uom}</td>
																		<td>
																			<input
																				style={{ textAlign: "right" }}
																				ref={inputRef1}
																				min={1}
																				max={10}
																				type="number"
																				className="qty-ctl"
																				step="1"
																				defaultValue={item.sit_inventory_qty}
																				onChange={(e) =>
																					handleQty(e, item.portal_item_code)
																				}
																			/>
																		</td>
																		<td>
																			{item.portal_mrp * item.sit_inventory_qty}
																		</td>
																	</tr>
																)
															)
														)}
													</>
												)}
											</tbody>
										</table>
									</div>
									<div className="cart-prod-list d-block d-sm-none">
										{loading ? (
											<ColorRing
												visible={true}
												height="80"
												width="100%"
												ariaLabel="blocks-loading"
												wrapperStyle={{ textAlign: "center" }}
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
											<>
												{orderData.map((item, index) => (
													<div className="cart-prod-div" key={index}>
														<div className="cart-prod-title">
															{item.portal_item_code}
														</div>
														<div className="cart-prod-desc">
															<span className="cart-prod-val">
																{item.portal_item_desc}
															</span>
														</div>
														<div className="cart-prod-desc">
															<span className="cart-prod-lbl">
																Physical Inventory:{" "}
															</span>
															<span className="cart-prod-val">
																{item.physical_inventory_qty}
															</span>
														</div>
														<div className="cart-prod-absqty">
															<span className="cart-prod-lbl">
																Allocate Qty:{" "}
															</span>
															<span className="cart-prod-val">
																{item.erp_commited_qty}
															</span>
														</div>
														<div className="cart-prod-price">
															<span className="cart-prod-lbl">Price: </span>
															<span className="cart-prod-val">
																{item.portal_mrp}
															</span>
														</div>
														<div className="cart-prod-desc">
															<span className="cart-prod-lbl">UOM: </span>
															<span className="cart-prod-val">{item.uom}</span>
														</div>
														{item.scheme && (
															<div className="cart-prod-desc">
																<span className="cart-prod-lbl">Schemes: </span>
																<span className="cart-prod-val">
																	Buy 5 case Get 1 Case Free
																</span>
															</div>
														)}
														<div className="cart-prod-qty1">
															<input
																style={{ textAlign: "right" }}
																min={1}
																max={10}
																ref={inputRef1}
																type="number"
																className="qty-ctl"
																step="1"
																defaultValue={item.sit_inventory_qty}
																onChange={(e) =>
																	handleQty(e, item.portal_item_code)
																}
															/>
														</div>
													</div>
												))}
											</>
										)}
									</div>
								</div>
								<div className="card-footer bg-white">
									<div className="row">
										<div className="col-md-3 mb-3 d-sm-block">
											<button
												type="button"
												onClick={addToCart}
												disabled={disableAddToCart || orderData.length === 0}
												className="btn btn-block btn-primary btn-md">
												<i className="fas fa-cart-shopping mr-2"></i> Add to
												Cart
											</button>
										</div>
										<div className="col-md-6 text-center">
											<div className="form-group mb-2">
												{" "}
												<span className="pr-4">
													<i className="fas fa-flag text-success  mr-2"></i>New
													Launch
												</span>{" "}
												<span className="pr-4">
													<i className="fas fa-flag text-info mr-2"></i> Promo
												</span>{" "}
												<span className="pr-4">
													<i className="fas fa-flag  mr-2"></i> Balance SKU's{" "}
												</span>{" "}
											</div>
										</div>
										<div className="col-md-3 d-none d-sm-block">
											<h4 className="m-0 text-success  text-center">
												Total: {cartTotal}
											</h4>
										</div>
									</div>
								</div>
							</div>
						</div>
						{/* <div className="col-md-4 d-none d-sm-block"> */}
						<div className="col-md-4 d-sm-block">
							<div className="card card-primary border-0 rounded-0 mb-3">
								<div
									className="card-header collapsepanel"
									data-toggle="collapse"
									data-target="#collapseTwo"
									aria-expanded="true">
									Order Summary
								</div>
								{addTocart.length > 0 && (
									<div
										className="card-body collapse show"
										id="collapseTwo"
										aria-expanded="true">
										<div className="cart-prod-list scroll">
											{addTocart != "null" &&
												addTocart.map(
													(item, index) => (
														(addToCartQty =
															addToCartQty + item.sit_inventory_qty),
														(addToCartTotal +=
															item.portal_mrp * item.sit_inventory_qty),
														(
															<div className="cart-prod-div" key={index}>
																<div className="cart-prod-trash">
																	<i
																		onClick={(e) => removeFromCart(e, item)}
																		className="text-danger fa fa-trash mr-1"></i>
																</div>
																<div className="cart-prod-title">
																	{item.portal_item_code}
																</div>
																<div className="cart-prod-desc">
																	<span className="cart-prod-val">
																		{item.portal_item_desc}
																	</span>
																</div>

																<div className="cart-prod-desc">
																	<span className="cart-prod-lbl">
																		Quantity:{" "}
																	</span>
																	<input
																		min={1}
																		style={{ textAlign: "right" }}
																		onChange={(e) =>
																			handleQtyInCart(e, item.portal_item_code)
																		}
																		// disabled={true}
																		type="number"
																		className="qty-ctl"
																		step="1"
																		defaultValue={item.sit_inventory_qty}
																	/>

																	<span className="cart-prod-lbl ml-2">
																		{item.sit_inventory_qty} * {item.portal_mrp}{" "}
																		=
																		<b>
																			{item.sit_inventory_qty * item.portal_mrp}
																		</b>
																	</span>
																</div>
															</div>
														)
													)
												)}
										</div>

										<p className="text-center d-none d-sm-block m-0 font-weight-bold">
											Total Unit:{" "}
											<span className="text-danger">
												{/* {parseInt(addToCartQty, 10)} */}

												{orderData.length + 1}
											</span>
										</p>
										<h1 className="text-center text-success d-none d-sm-block">
											{addToCartTotal}
										</h1>

										<button
											type="button"
											className="btn btn-primary btn-block btn-lg my-3 d-sm-block d-none">
											Place Order{" "}
											<i className="fa-solid fa-circle-arrow-right"></i>
										</button>
									</div>
								)}
							</div>
						</div>
						<div className="col-12 d-sm-none d-sm-none">
							<button
								onClick={() => setDisableFilter(false)}
								type="button"
								className="collapsepanel btn btn-primary btn-block btn-lg my-3"
								data-toggle="collapse"
								data-target="#collapseAll"
								aria-expanded="true">
								Add More Line <i className="fa-solid fa-circle-arrow-right"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="atc-footer-mobile d-block d-sm-none">
				<div className="atcm-button-group">
					{" "}
					<a
						href="#modalshowcart"
						className="atcm-total-amount"
						data-toggle="modal">
						<span className="atcm-icon">
							<i className="fas fa-cart-shopping mr-2"></i>
						</span>
						<span className="atcm-text">
							<span className="atc-unit">
								Unit: {addToCart.length + 1}
								{/* {parseInt(cartTotalQty, 10)} */}
							</span>
							<span className="atc-total">{addToCartTotal}</span>
						</span>
					</a>{" "}
					<a href="#" className="atcm-place-order">
						<span>Place Order</span>
						<i className="fa-solid fa-circle-arrow-right"></i>
					</a>{" "}
				</div>
			</div>
			<div
				className="modal bd-example-modal-lg fade"
				id="modalshowcart"
				tabIndex="-1"
				role="dialog"
				aria-labelledby="exampleModalLabel"
				aria-hidden="true">
				<div className="modal-dialog modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								ORDER SUMMARY
							</h5>
							<button
								className="close"
								type="button"
								data-dismiss="modal"
								aria-label="Close">
								{" "}
								<span aria-hidden="true">×</span>{" "}
							</button>
						</div>
						<div className="modal-body">
							<div className="cart-prod-list">
								<div className="cart-prod-div">
									<div className="cart-prod-title">Macaroni - FG -8114044</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-val">
											CHEF'S BASKET-PASTA-MACARONI-POUCH-60X180gm
										</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Physical Inventory: </span>
										<span className="cart-prod-val">20</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Allocate Qty: </span>
										<span className="cart-prod-val">5</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Price: </span>
										<span className="cart-prod-val">2222.5</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">UOM: </span>
										<span className="cart-prod-val">Case</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Schemes: </span>
										<span className="cart-prod-val">
											Buy 5 case Get 1 Case Free
										</span>
									</div>
									<div className="cart-prod-qty">
										<input
											style={{ textAlign: "right" }}
											type="number"
											className="qty-ctl"
											step="1"
											defaultValue="3"
										/>
									</div>
								</div>
								<div className="cart-prod-div">
									<div className="cart-prod-title">Macaroni - FG -8114044</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-val">
											CHEF'S BASKET-PASTA-MACARONI-POUCH-60X180gm
										</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Physical Inventory: </span>
										<span className="cart-prod-val">20</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Allocate Qty: </span>
										<span className="cart-prod-val">5</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Price: </span>
										<span className="cart-prod-val">2222.5</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">UOM: </span>
										<span className="cart-prod-val">Case</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Schemes: </span>
										<span className="cart-prod-val">
											Buy 5 case Get 1 Case Free
										</span>
									</div>
									<div className="cart-prod-qty">
										<input
											style={{ textAlign: "right" }}
											type="number"
											className="qty-ctl"
											step="1"
											defaultValue="3"
										/>
									</div>
								</div>
								<div className="cart-prod-div">
									<div className="cart-prod-title">Macaroni - FG -8114044</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-val">
											CHEF'S BASKET-PASTA-MACARONI-POUCH-60X180gm
										</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Physical Inventory: </span>
										<span className="cart-prod-val">20</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Allocate Qty: </span>
										<span className="cart-prod-val">5</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Price: </span>
										<span className="cart-prod-val">2222.5</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">UOM: </span>
										<span className="cart-prod-val">Case</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Schemes: </span>
										<span className="cart-prod-val">
											Buy 5 case Get 1 Case Free
										</span>
									</div>
									<div className="cart-prod-qty">
										<input
											style={{ textAlign: "right" }}
											type="number"
											className="qty-ctl"
											step="1"
											defaultValue="3"
										/>
									</div>
								</div>
								<div className="cart-prod-div">
									<div className="cart-prod-title">Macaroni - FG -8114044</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-val">
											CHEF'S BASKET-PASTA-MACARONI-POUCH-60X180gm
										</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Physical Inventory: </span>
										<span className="cart-prod-val">20</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Allocate Qty: </span>
										<span className="cart-prod-val">5</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Price: </span>
										<span className="cart-prod-val">2222.5</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">UOM: </span>
										<span className="cart-prod-val">Case</span>
									</div>
									<div className="cart-prod-desc">
										<span className="cart-prod-lbl">Schemes: </span>
										<span className="cart-prod-val">
											Buy 5 case Get 1 Case Free
										</span>
									</div>
									<div className="cart-prod-qty">
										<input
											style={{ textAlign: "right" }}
											type="number"
											className="qty-ctl"
											step="1"
											defaultValue="3"
										/>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<div className="atcm-button-group">
								{" "}
								<a href="#" className="atcm-total-amount">
									<span className="atcm-icon">
										<i className="fas fa-cart-shopping mr-2"></i>
									</span>
									<span className="atcm-text">
										<span className="atc-unit">Unit: 5</span>
										<span className="atc-total">{cartTotal}</span>
									</span>
								</a>{" "}
								<a href="#" className="atcm-place-order">
									<span>Place Order</span>
									<i className="fa-solid fa-circle-arrow-right"></i>
								</a>{" "}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PlaceOrder;
