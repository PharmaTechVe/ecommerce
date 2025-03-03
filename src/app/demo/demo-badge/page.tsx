import React from 'react';
import Badge from '@/components/Badge';

const BadgeExamplePage: React.FC = () => {
  return (
    <div className="w-85 flex flex-col items-center gap-6 bg-white p-8">
      <h1 className="font-popins text-2xl">Ejemplo de Badges</h1>

      {/* Variaciones de tamaño */}
      <div className="flex flex-wrap gap-4">
        <Badge
          borderRadius="square"
          variant="filled"
          color="primary"
          size="small"
        >
          Primary
        </Badge>
        <Badge
          borderRadius="square"
          variant="filled"
          color="warning"
          size="small"
        >
          Warning
        </Badge>
        <Badge
          borderRadius="square"
          variant="filled"
          color="danger"
          size="small"
        >
          Danger
        </Badge>
        <Badge
          borderRadius="square"
          variant="filled"
          color="success"
          size="small"
        >
          {' '}
          Success
        </Badge>
        <Badge borderRadius="square" variant="filled" color="info" size="small">
          Info
        </Badge>
      </div>
      <div className="flex flex-wrap gap-4">
        <Badge
          borderRadius="square"
          variant="outlined"
          color="primary"
          size="small"
        >
          Primary
        </Badge>
        <Badge
          borderRadius="square"
          variant="outlined"
          color="warning"
          size="small"
        >
          Warning
        </Badge>
        <Badge
          borderRadius="square"
          variant="outlined"
          color="danger"
          size="small"
        >
          Danger
        </Badge>
        <Badge
          borderRadius="square"
          variant="outlined"
          color="success"
          size="small"
        >
          Success
        </Badge>
        <Badge
          borderRadius="square"
          variant="outlined"
          color="info"
          size="small"
        >
          Info
        </Badge>
      </div>

      {/* Diferentes variantes */}
      <div className="flex flex-wrap gap-4">
        <Badge
          borderRadius="rounded"
          variant="filled"
          color="primary"
          size="small"
        >
          Primary
        </Badge>
        <Badge
          borderRadius="rounded"
          variant="filled"
          color="warning"
          size="small"
        >
          Warning
        </Badge>
        <Badge
          borderRadius="rounded"
          variant="filled"
          color="danger"
          size="small"
        >
          Danger
        </Badge>
        <Badge
          borderRadius="rounded"
          variant="filled"
          color="success"
          size="small"
        >
          Success
        </Badge>
        <Badge
          borderRadius="rounded"
          variant="filled"
          color="info"
          size="small"
        >
          Info
        </Badge>
      </div>
      <div className="flex flex-wrap gap-4">
        <Badge
          borderRadius="rounded"
          variant="outlined"
          color="primary"
          size="small"
        >
          Primary
        </Badge>
        <Badge
          borderRadius="rounded"
          variant="outlined"
          color="warning"
          size="small"
        >
          Warning
        </Badge>
        <Badge
          borderRadius="rounded"
          variant="outlined"
          color="danger"
          size="small"
        >
          Danger
        </Badge>
        <Badge
          borderRadius="rounded"
          variant="outlined"
          color="success"
          size="small"
        >
          Success
        </Badge>
        <Badge
          borderRadius="rounded"
          variant="outlined"
          color="info"
          size="small"
        >
          Info
        </Badge>
      </div>
    </div>
  );
};

export default BadgeExamplePage;
