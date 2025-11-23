"use client";

import React, { FC, useState } from "react";

const ReadMoreExample: FC = () => {
  const [expand, setExpand] = useState(false);

  const text = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates quam odit aut praesentium autem exercitationem, laboriosam voluptatem excepturi, modi eaque magni placeat perferendis ex, perspiciatis id at similique. Ad nostrum, explicabo hic nemo deserunt temporibus officiis officia ratione magnam, facere, consequatur eos praesentium? Ut quia minima, corporis a aliquam esse deserunt eveniet facilis delectus est nulla repellat quibusdam maiores natus at! Consequatur facere dolore, soluta odio maxime esse. Distinctio consequuntur aspernatur est et eaque eveniet sunt perferendis aliquam sint cupiditate accusamus ab, cumque, necessitatibus officiis excepturi. Ipsum, id voluptates...`;

  const toggleButton = () => setExpand(!expand);

  return (
    <div className="m-5 p-5 bg-gray-100 rounded-md shadow-md max-w-xl">
      <div className="flex justify-between items-start">
        <p className="text-gray-700">
          {expand ? text : text.substring(0, 200) + "..."}
        </p>
        <button
          onClick={toggleButton}
          className="ml-4 bg-blue-500 text-white cursor-pointer rounded-md px-4 py-2 hover:bg-blue-600 transition"
        >
          {expand ? "−" : "+"}
        </button>
      </div>
    </div>
  );
};

export default ReadMoreExample;
