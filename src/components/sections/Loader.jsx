import React from 'react'
import { StyledLoader } from './StyledLoader'
export default function Loader() {

    return (
        <div>
            <StyledLoader>
                <div className="load">
                    <img src="./img/load.png" alt="" />
                </div>
            </StyledLoader>

        </div>
    )
}
