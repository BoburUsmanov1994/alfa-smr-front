import React from 'react';
import {get, includes, isEqual} from "lodash";
import {Trash2, Edit, Eye} from "react-feather";
import {useNavigate} from "react-router-dom";
import {useSettingsStore} from "../../../store";

const GridTableBody = ({
                           tableHeaderData = [],
                           tableBodyData = [],
                           remove = () => {
                           },
                           openEditModal = () => {
                           },
                           page,
                           viewUrl = null,
                           updateUrl = null,
                           dataKey = null,
                           pageSize=20
                       }) => {
    const navigate = useNavigate();
    const role = useSettingsStore(state=>get(state,'role','admin'))
    return (
        <>
            {
                tableBodyData && tableBodyData.map((tr, i) => <tr key={get(tr, '_id', i)}>
                    <td>{(page - 1) * 20 + (i + 1)}</td>
                    {
                        tableHeaderData && tableHeaderData.map((td, j) => <td className={get(td, "classnames", "")}>
                            {get(td, 'render')
                                ?
                                get(td, 'render')({
                                    value:get(tr, get(td, 'key')),
                                    row:tr,
                                    index:i+(page-1)*pageSize+1
                                })
                                :
                                get(tr, get(td, 'key'))}
                        </td>)
                    }
                    <td>{viewUrl && <Eye
                        onClick={() => navigate(`${viewUrl}/${dataKey ? get(tr, dataKey, null) : get(tr, '_id', null)}`)}
                        className={'cursor-pointer mr-10'} size={20} color={'#78716c'}/>}
                        {!includes(['payed','sent'],get(tr,'status')) && !isEqual(role,'user') && <>
                        <Edit
                        onClick={() => {
                            if (updateUrl) {
                                navigate(`${updateUrl}/${dataKey ? get(tr, dataKey, null) : get(tr, '_id', null)}`)
                                return
                            }
                            openEditModal(get(tr, '_id', null))
                        }} className={'cursor-pointer mr-10'} size={20}
                        color={'#13D6D1'}/>
                        <Trash2 onClick={() => remove(dataKey ? get(tr, dataKey, null) : get(tr, '_id', null))}
                                className={'cursor-pointer '} size={20} color={'#dc2626'}/>
                        </>}
                    </td>
                </tr>)
            }
        </>
    );
};

export default GridTableBody;