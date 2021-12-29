import React from "react";
import { ethers } from "ethers";
import axios from "axios";

const API_URL = "http://localhost:4000";

const ITEMS = [
  {
    id: 1,
    name: "Item1",
    priceLabel: "100 DAI",
    price: ethers.utils.parseEther("100"),
  },
  {
    id: 2,
    name: "Item2",
    priceLabel: "200 DAI",
    price: ethers.utils.parseEther("200"),
  },
];

function Store({ paymentProcessor, dai }) {
  const buy = async (item) => {
    console.log("initialized");
    const response1 = await axios.get(`${API_URL}/api/getPaymentId/${item.id}`);

    console.log("response1", response1);

    // Approve payment processor to spend our DAI
    const tx1 = await dai.approve(paymentProcessor.address, item.price);
    await tx1.wait(); // waiting for the transaction to be mined

    console.log("dai approved");

    // Make the actual payment
    const tx2 = await paymentProcessor.pay(
      item.price,
      response1.data.paymentId
    );
    await tx2.wait();

    console.log("made actual payment");

    // So that the backend have some time for the event listening
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const response2 = await axios.get(
      `${API_URL}/api/getItemUrl/${response1.data.paymentId}`
    );

    console.log("response2");
    console.log(response2);
  };

  return (
    <ul className="list-group">
      {ITEMS.map((item) => (
        <li key={item.id} className="list-group-item">
          {item.name} -{" "}
          <span className="font-weight-bold">{item.priceLabel}</span>
          <button
            type="button"
            className="btn btn-primary btn-sm float-end"
            onClick={() => buy(item)}
          >
            Buy
          </button>
        </li>
      ))}
    </ul>
  );
}

export default Store;
