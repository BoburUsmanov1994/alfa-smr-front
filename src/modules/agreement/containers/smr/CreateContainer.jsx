import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../../store";
import {get, head, isEqual} from "lodash";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../../components/section";
import Title from "../../../../components/ui/title";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Flex from "../../../../components/flex";
import Field from "../../../../containers/form/field";
import {useGetAllQuery, usePostQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {getSelectOptionsListFromData} from "../../../../utils";
import {OverlayLoader} from "../../../../components/loader";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";


const CreateContainer = ({...rest}) => {
    const [agentId, setAgentId] = useState(null)
    const [organization, setOrganization] = useState(null)
    const [inn, setInn] = useState(null)
    const [agencyId, setAgencyId] = useState(null)
    const [oked, setOked] = useState(null)
    const setBreadcrumbs = useStore(state => get(state, 'setBreadcrumbs', () => {
    }))
    const navigate = useNavigate();
    const breadcrumbs = useMemo(() => [{
        id: 1, title: 'SMR', path: '/smr',
    }, {
        id: 2, title: 'Добавить SMR', path: '/smr/create',
    }], [])

    const {t} = useTranslation()

    const user = useStore((state) => get(state, 'user'))


    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])

    const {data: filials, isLoading: isLoadingFilials} = useGetAllQuery({key: KEYS.agencies, url: URLS.agencies})
    const filialList = getSelectOptionsListFromData(get(filials, `data.result`, []), 'id', 'name')


    const {data: okeds} = useGetAllQuery({
        key: KEYS.okeds, url: URLS.okeds
    })
    const okedList = getSelectOptionsListFromData(get(okeds, `data.result`, []), 'id', 'name')


    const {data: agents} = useGetAllQuery({
        key: [KEYS.agents, agencyId],
        url: URLS.agents,
        params: {
            params: {
                branch: agencyId
            }
        },
        enabled: !!(agencyId)
    })
    const agentsList = getSelectOptionsListFromData(get(agents, `data.result`, []), 'id', 'name')


    const {
        mutate: getOrganizationInfoRequest, isLoading: isLoadingOrganizationInfo
    } = usePostQuery({listKeyId: KEYS.organizationInfoProvider})

    const {
        mutate: calculatePremiumRequest
    } = usePostQuery({listKeyId: KEYS.osgorCalculate, hideSuccessToast: true})
    const {
        mutate: createRequest
    } = usePostQuery({listKeyId: KEYS.osgorCreate})


    const getOrgInfo = () => {
        getOrganizationInfoRequest({
                url: URLS.organizationInfoProvider, attributes: {
                    inn
                }
            },
            {
                onSuccess: ({data}) => {
                    setOrganization(get(data, 'result'))
                }
            }
        )
    }

    const calculatePremium = () => {
        calculatePremiumRequest({
                url: URLS.osgorCalculate, attributes: {
                    insuranceSum: 1
                }
            },
            {
                onSuccess: ({data}) => {
                    console.log(get(data, 'result.insurancePremium'))
                }
            }
        )
    }

    const getFieldData = (name, value) => {
        if (isEqual(name, 'insurant.organization.oked')) {
            setOked(value)
        }
        if (isEqual(name, 'insurant.oked')) {
            setOked(value)
        }
        if (isEqual(name, 'agencyId')) {
            setAgencyId(value)
        }
        if (isEqual(name, 'agentId')) {
            setAgentId(value)
        }
    }
    const create = ({data}) => {
        const {
            activityRisk,
            birthDate,
            fot,
            funeralExpensesSum,
            passportNumber,
            passportSeries,
            rewardPercent,
            rewardSum,
            risk,
            rpmPercent,
            rpmSum,
            policies,
            agentId,
            insurant: insurantType,
            ...rest
        } = data
        createRequest({
                url: URLS.osgorCreate, attributes: {
                    agentId: String(agentId),
                    sum: get(head(policies), 'insuranceSum', 0),
                    contractStartDate: get(head(policies), 'startDate'),
                    contractEndDate: get(head(policies), 'endDate'),
                    insurant: [],
                    ...rest
                }
            },
            {
                onSuccess: ({data: response}) => {
                    if (get(response, 'result.osgor_formId')) {
                        navigate(`/srm/view/${get(response, 'result.osgor_formId')}`);
                    } else {
                        navigate(`/srm`);
                    }
                },
            }
        )
    }
    useEffect(() => {
        if (false) {
            calculatePremium()
        }
    }, [])

    if (isLoadingFilials) {
        return <OverlayLoader/>
    }


    return (<>
        {(isLoadingOrganizationInfo) && <OverlayLoader/>}
        <Panel>
            <Row>
                <Col xs={12}>
                    <Search/>
                </Col>
            </Row>
        </Panel>
        <Section>
            <Row>
                <Col xs={12}>
                    <Title>СМР</Title>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Form formRequest={create} getValueFromField={(value, name) => getFieldData(name, value)}
                          footer={<Flex className={'mt-32'}><Button type={'submit'}
                                                                    className={'mr-16'}>Сохранить</Button><Button
                              type={'button'} gray className={'mr-16'}>Подтвердить
                              оплату</Button><Button type={'button'} gray className={'mr-16'}>Отправить в Фонд</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={5}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>Новый</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Филиал </Col>
                                    <Col xs={7}><Field defaultValue={get(user, 'branch_Id.fond_id')}
                                                       label={'Filial'} params={{required: true}} options={filialList}
                                                       property={{hideLabel: true}} type={'select'}
                                                       name={'branch_id'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер договора
                                        страхования: </Col>
                                    <Col xs={7}><Field params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'contract_number'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата договора страхования: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'contract_date'}/></Col>
                                </Row>

                            </Col>
                            <Col xs={5}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Серия полиса: </Col>
                                    <Col xs={7}><Field params={{required: true}}
                                                       property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'policy.seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер полиса: </Col>
                                    <Col xs={7}><Field params={{required: true}}
                                                       property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'policy.number'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{
                                            hideLabel: true,
                                            dateFormat: 'dd.MM.yyyy'
                                        }}
                                        type={'datepicker'}
                                        name={'policy.issue_date'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата начала: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'policy.s_date'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата окончания: </Col>
                                    <Col xs={7}><Field property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'policy.e_date'}/></Col>
                                </Row>
                            </Col>

                        </Row>
                        <Row gutterWidth={60} className={'mt-15'}>
                            <Col xs={12} className={'mb-15'}><Title>Страхователь</Title></Col>
                            <Col xs={12}>
                                <Row>
                                    <Col xs={4}>
                                        <Flex>
                                            <h4 className={'mr-16'}>Страхователь</h4>
                                            <Button
                                                type={'button'}>Юр.
                                                лицо</Button>
                                        </Flex>
                                    </Col>
                                    <Col xs={8} className={'text-right'}>
                                        <Flex justify={'flex-end'}>
                                            <Field property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_',
                                                onChange: (val) => setInn(val)
                                            }} name={'inn'} type={'input-mask'}/>

                                            <Button onClick={getOrgInfo} className={'ml-15'} type={'button'}>Получить
                                                данные</Button>
                                        </Flex>
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                            <>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} label={'INN'} defaultValue={inn} property={{
                                        mask: '999999999',
                                        placeholder: 'Inn',
                                        maskChar: '_'
                                    }} name={'insurant.inn'} type={'input-mask'}/>

                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(organization, 'name')}
                                           label={'Наименование'} type={'input'}
                                           name={'insurant.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Руководитель'} type={'input'}
                                           name={'insurant.dir_name'}/>
                                </Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(organization, 'address')} params={{required: true}}
                                           label={'Address'} type={'input'}
                                           name={'insurant.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(organization, 'phone')} params={{
                                        required: true,
                                        pattern: /^998(9[012345789]|6[125679]|7[01234569])[0-9]{7}$/
                                    }}
                                           label={'Телефон'} type={'input'}
                                           name={'insurant.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}}
                                           options={okedList}
                                           defaultValue={parseInt(get(organization, 'oked'))}
                                           label={'ОКЭД'}
                                           type={'select'}
                                           name={'insurant.oked'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Bank'} type={'input'}
                                           name={'insurant.bank_name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Bank mfo'} type={'input'}
                                           name={'insurant.mfo'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field label={'Расчетный счет'} type={'input'}
                                           name={'insurant.bank_rs'}/>
                                </Col>
                            </>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер лота: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.lot_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер контакта строительства: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.dog_num'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата договора строительства: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'policy.dog_date'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Название объекта: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.stroy_name'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Адрес и место
                                        расположение объекта: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.stroy_address'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая стоимость: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'building.stroy_price'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Общая страховая сумма: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'policy.ins_sum_otv'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Общая страховая премия: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'policy.ins_sum_otv'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={12}>
                                <hr className={'mt-15 mb-15'}/>
                            </Col>
                        </Row>
                        <Row className={'mt-15'}>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Агент (автоматически): </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'select'}
                                        name={'agent_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Комиссия агента: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'agent_comission'}/></Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Section>
    </>);
};

export default CreateContainer;