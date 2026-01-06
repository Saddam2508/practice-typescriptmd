import React, { useState } from 'react';

const CssPractice = () => {
  const [close, setClose] = useState(false);
  const [open, setOpen] = useState(false);

  const para =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium veritatis voluptatem doloremque nisi voluptas rem deserunt quibusdam? Molestias nostrum debitis, deserunt nulla, excepturi recusandae fugit mollitia voluptatum atque cum sed doloribus, explicabo non ducimus soluta! Ducimus quaerat fugit deleniti sunt vitae error optio provident odit maxime ut laudantium quibusdam placeat maiores tenetur itaque neque tempora dolore laboriosam sapiente quas quos obcaecati, illo blanditiis dolorum. Tempore assumenda corporis nesciunt repellendus perspiciatis illum voluptate sit adipisci at dolor doloremque nihil maiores ipsum saepe deleniti laudantium ea doloribus quos id, minima, illo incidunt. Ipsa accusamus odio reiciendis mollitia, maxime consequatur vitae et reprehenderit.';

  const togglePara = () => {
    setOpen(true);
  };

  const removeAllMenus = () => {
    setOpen(false);
  };

  return (
    <div style={{ margin: 20 }}>
      <p style={{ display: 'inline' }}>
        {close ? para : para.substring(0, 100) + '...'}
      </p>
      <button
        style={{ padding: 7, background: 'gray', borderRadius: 5 }}
        onClick={togglePara}
      >
        {close ? '-' : '+'}
      </button>

      {open && (
        <div
          style={{
            background: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            display: 'flex',
            inset: 0,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 20,
              width: 350,
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <h3> Delete All Menus</h3>
            <p>This action cannot be undone.</p>
            <div style={{ marginTop: 15 }}>
              <button
                onClick={() => {
                  setClose(!close);
                  removeAllMenus();
                }}
                style={{ marginRight: 10, background: 'red', color: '#fff' }}
              >
                Yes, Delete
              </button>

              <button
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CssPractice;
