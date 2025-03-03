'use client';
import React from 'react';
import Alert from '@/components/Alert';

const AlertsPage: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 p-6">
      <Alert
        variant="outlined"
        color="warning"
        title="Attention needed"
        message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when"
        backgroundColor="white"
      />
      <Alert
        variant="filled"
        color="warning"
        title="Attention needed"
        message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when"
        backgroundColor="gray-300"
      />

      <Alert
        variant="filled"
        color="success"
        title="Message Sent Successfull"
        message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when"
        backgroundColor="white"
      />

      <Alert
        variant="filled"
        color="success"
        title="Message Sent Successfull"
        message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when"
        backgroundColor="gray-300"
      />
      <Alert
        variant="text"
        color="success"
        title="Your item has been added successfull."
        message=""
        backgroundColor="gray-300"
      />

      <Alert
        variant="filled"
        color="danger"
        title="There were 2 errors with your submission"
        message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when"
        backgroundColor="white"
      />

      <Alert
        variant="outlined"
        color="danger"
        title="There were 2 errors with your submission"
        message="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
        backgroundColor="gray-300"
      />

      <Alert
        variant="filled"
        color="danger"
        title="Something went wrong!"
        message=""
        backgroundColor="gray-300"
      />
      <Alert
        variant="filled"
        color="info"
        title="Important Notice"
        message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when"
        backgroundColor="white"
      />
      <Alert
        variant="filled"
        color="info"
        title="Important Notice"
        message="Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when"
        backgroundColor="cyan-50"
      />
    </div>
  );
};

export default AlertsPage;
