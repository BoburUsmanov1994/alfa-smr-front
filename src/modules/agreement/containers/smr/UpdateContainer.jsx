import React, {useEffect, useMemo, useState} from 'react';
import {useStore} from "../../../../store";
import {get} from "lodash";
import Panel from "../../../../components/panel";
import Search from "../../../../components/search";
import {Col, Row} from "react-grid-system";
import Section from "../../../../components/section";
import Title from "../../../../components/ui/title";
import Button from "../../../../components/ui/button";
import Form from "../../../../containers/form/form";
import Flex from "../../../../components/flex";
import Field from "../../../../containers/form/field";
import {useGetAllQuery, usePutQuery} from "../../../../hooks/api";
import {KEYS} from "../../../../constants/key";
import {URLS} from "../../../../constants/url";
import {OverlayLoader} from "../../../../components/loader";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";


const UpdateContainer = ({contract_id = null}) => {
    const [inn, setInn] = useState(null)
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

    const {data, isLoading} = useGetAllQuery({
        key: KEYS.osgorView,
        url: URLS.osgorView,
        params: {
            params: {
                contract_id: contract_id
            }
        },
        enabled: !!(contract_id)
    })

    const {
        mutate: updateRequest, isLoading: isLoadingPatch
    } = usePutQuery({listKeyId: KEYS.osgorEdit})

    useEffect(() => {
        setBreadcrumbs(breadcrumbs)
    }, [])


    const getFieldData = (name, value) => {

    }
    const update = ({data}) => {
        const {insurant, agent_comission, ...rest} = data;
        updateRequest({
                url: URLS.osgorEdit, attributes: {
                    agent_comission: parseFloat(agent_comission),
                    insurant: {...insurant, phone: `${get(insurant, 'phone')}`},
                    ...rest,
                    contract_id: parseInt(contract_id)
                }
            },
            {
                onSuccess: ({data: response}) => {
                    if (get(response, 'data.contract_id')) {
                        navigate(`/smr/view/${get(response, 'data.contract_id')}`);
                    } else {
                        navigate(`/smr`);
                    }
                },
            }
        )
    }

    if (isLoading) {
        return <OverlayLoader/>
    }
    return (<>
        {(isLoadingPatch) && <OverlayLoader/>}
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
                    <Form formRequest={update} getValueFromField={(value, name) => getFieldData(name, value)}
                          footer={<Flex className={'mt-32'}><Button type={'submit'}
                                                                    className={'mr-16'}>Сохранить</Button><Button
                              onClick={() => navigate('/smr')} type={'button'} danger
                              className={'mr-16'}>Отменить</Button></Flex>}>
                        <Row gutterWidth={60} className={'mt-32'}>
                            <Col xs={5}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Статус</Col>
                                    <Col xs={7}><Button green>{get(data, 'data.data.status')}</Button></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Филиал </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.branch_id')}
                                                       label={'Filial'}
                                                       property={{hideLabel: true}} type={'input'}
                                                       name={'branch_id'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер договора
                                        страхования: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.contract_number')}
                                                       params={{required: true}} property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'contract_number'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата договора страхования: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.contract_date')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
                                                       type={'datepicker'}
                                                       name={'contract_date'}/></Col>
                                </Row>

                            </Col>
                            <Col xs={5}>

                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Серия полиса: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.policy.seria')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'policy.seria'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер полиса: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.policy.number')}
                                                       params={{required: true}}
                                                       property={{hideLabel: true}}
                                                       type={'input'}
                                                       name={'policy.number'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата выдачи полиса: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.policy.issue_date')}
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
                                        defaultValue={get(data, 'data.data.policy.s_date')}
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'policy.s_date'}/></Col>
                                </Row>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата окончания: </Col>
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.policy.e_date')}
                                                       property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}}
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
                                            <Field defaultValue={get(data, 'data.data.insurant.inn')} property={{
                                                hideLabel: true,
                                                mask: '999999999',
                                                placeholder: 'Inn',
                                                maskChar: '_',
                                                onChange: (val) => setInn(val)
                                            }} name={'inn'} type={'input-mask'}/>

                                            <Button className={'ml-15'} type={'button'}>Получить
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
                                    <Field params={{required: true}} label={'INN'}
                                           defaultValue={get(data, 'data.data.insurant.inn')} property={{
                                        mask: '999999999',
                                        placeholder: 'Inn',
                                        maskChar: '_'
                                    }} name={'insurant.inn'} type={'input-mask'}/>

                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field params={{required: true}} defaultValue={get(data, 'data.data.insurant.name')}
                                           label={'Наименование'} type={'input'}
                                           name={'insurant.name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.dir_name')}
                                           params={{required: true}} label={'Руководитель'} type={'input'}
                                           name={'insurant.dir_name'}/>
                                </Col>

                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.address')}
                                           params={{required: true}}
                                           label={'Address'} type={'input'}
                                           name={'insurant.address'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.phone')} params={{
                                        required: true
                                    }}
                                           label={'Телефон'} type={'input'}
                                           name={'insurant.phone'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.oked')} params={{required: true}}
                                           label={'ОКЭД'}
                                           type={'input'}
                                           name={'insurant.oked'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.bank_name')}
                                           params={{required: true}} label={'Bank'} type={'input'}
                                           name={'insurant.bank_name'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.mfo')} params={{required: true}}
                                           label={'Bank mfo'} type={'input'}
                                           name={'insurant.mfo'}/>
                                </Col>
                                <Col xs={3} className={'mb-25'}>
                                    <Field defaultValue={get(data, 'data.data.insurant.bank_rs')}
                                           params={{required: true}} label={'Расчетный счет'} type={'input'}
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
                                        defaultValue={get(data, 'data.data.building.lot_id')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.lot_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Номер контакта строительства: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.dog_num')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.dog_num'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Дата договора строительства: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.dog_date')}
                                        params={{required: true}}
                                        property={{hideLabel: true, dateFormat: 'dd.MM.yyyy'}} type={'datepicker'}
                                        name={'building.dog_date'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Название объекта: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.stroy_name')}
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
                                        defaultValue={get(data, 'data.data.building.stroy_address')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'building.stroy_address'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Страховая стоимость: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.building.stroy_price')}
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
                            <Col xs={5}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Общая страховая сумма: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.policy.ins_sum')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'policy.ins_sum'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={5}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Общая страховая премия: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.policy.ins_premium')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'policy.ins_premium'}/></Col>
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
                                    <Col xs={7}><Field defaultValue={get(data, 'data.data.agent_id')}
                                                       property={{hideLabel: true}} type={'input'}
                                                       name={'agent_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Комиссия агента: </Col>
                                    <Col xs={7}><Field

                                        defaultValue={get(data, 'data.data.agent_comission')}
                                        property={{hideLabel: true}} type={'number-format-input'}
                                        name={'agent_comission'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Транзакционный номер заявки: </Col>
                                    <Col xs={7}><Field
                                        defaultValue={get(data, 'data.data.policy.claim_id')}
                                        params={{required: true}}
                                        property={{hideLabel: true}} type={'input'}
                                        name={'policy.claim_id'}/></Col>
                                </Row>
                            </Col>
                            <Col xs={4}>
                                <Row align={'center'} className={'mb-25'}>
                                    <Col xs={5}>Прикрепить полис: </Col>
                                    <Col xs={7}><Field
                                        params={{required: true}}
                                        property={{
                                            hideLabel: true,
                                            contract_id,
                                            seria: get(data, 'data.data.policy.seria'),
                                            number: get(data, 'data.data.policy.number')
                                        }} type={'dropzone'}
                                        name={'policy.file_id'}/></Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </Section>
    </>);
};

export default UpdateContainer;