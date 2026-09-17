# Collection Querying

Collection endpoints use page-based pagination. Query parameters are optional and default to `page=1`, `limit=10`, and descending creation time where applicable.

```text
?page=1&limit=10
?search=backend
?sortBy=createdAt&sortOrder=desc
?status=ACTIVE
?page=1&limit=10&search=backend&status=ACTIVE&sortBy=createdAt&sortOrder=desc
```

Responses include `data` and `pagination`:

```json
{
  "success": true,
  "message": "Projects retrieved successfully",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

## Supported Collections

| Endpoint                           | Search                     | Filters                                        | Sort fields                       |
| ---------------------------------- | -------------------------- | ---------------------------------------------- | --------------------------------- |
| `GET /projects`                    | `name`, `description`      | `status`, `teamId`                             | `name`, `createdAt`, `updatedAt`  |
| `GET /teams`                       | `name`, `description`      | none                                           | `name`, `createdAt`, `updatedAt`  |
| `GET /tasks/projects/:projectId`   | `title`, `description`     | `status`, `priority`, `assigneeId`, `sprintId` | `title`, `createdAt`, `updatedAt` |
| `GET /sprints/projects/:projectId` | `name`, `goal`             | `status`                                       | `name`, `createdAt`, `updatedAt`  |
| `GET /comments/tasks/:taskId`      | `content`                  | none                                           | `createdAt`, `updatedAt`          |
| `GET /organizations/members`       | member `fullName`, `email` | `role`, membership `status`                    | `createdAt`, `updatedAt`, `role`  |
| `GET /subscriptions/history`       | payment `transactionId`    | payment `status`                               | `createdAt`, `updatedAt`          |

`limit` must be between 1 and 100. `sortBy` values are allowlisted per endpoint. All collection queries retain organization ownership checks and exclude soft-deleted records where the resource supports soft deletion.
