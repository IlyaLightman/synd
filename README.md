# Synd

Service for tokenization of syndicated venture investments

University graduation project

Monorepo: turbo, Next.js, Fastify

`pnpm run dev`

## Frontend

Next.js + wagmi

### Contract interactions

There is ERC1155-like contract

_Admin of the club:_

-   Create new deal token
-   Get gathered ETH if allocation is reached (to invest in real world)
-   Add ETH when deal is done (after exit event in real world)

_User, investor:_

-   Buy tokens
-   Refund ETH if allocation is not reached
-   Claim ETH for tokens when deal is done

## Backed

Fastify + Prisma ORM
DB: Postgres

### Routes

-   GET /deals — get all deals
-   GET /deal/{id} - get deal data (+ token data)

_Only admin, verification by message signing:_

-   POST /deal - create new deal record
-   POST /deal/token - create token record for the deal
