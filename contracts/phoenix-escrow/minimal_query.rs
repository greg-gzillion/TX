pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::GetConfig {} => {
            let config = CONFIG.load(deps.storage)?;
            to_json_binary(&ConfigResponse { admin: config.admin })
        }
        QueryMsg::GetAuction { id } => {
            let auction = AUCTIONS.load(deps.storage, id)?;
            to_json_binary(&auction)
        }
        QueryMsg::ListAuctions { start_after, limit } => {
            let auctions = list_auctions(deps, start_after, limit)?;
            to_json_binary(&AuctionsResponse { auctions })
        }
        // Temporarily comment out GetCompletedAuctions to get it working
        // QueryMsg::GetCompletedAuctions { start_after, limit } => {
        //     let auctions = query_completed_auctions(deps, start_after, limit)?;
        //     to_json_binary(&auctions)
        // }
    }
}
