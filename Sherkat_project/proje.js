
upload_file = formVO.getFile('excel_file')
format_type = StringUtil.extractLast(upload_file.getName(), '.');
if ('' + format_type == 'zip' || '' + format_type == 'ZIP') {
    billFiles = ExpressionUtil.getZipArchiveFiles(upload_file);
    billFilessize = billFiles.size();
} else {
    billFiles = [];
    billFiles.push(upload_file);
    billFilessize = billFiles.length;
    //get_item = billFiles[f];
}
error_msg = '';
//System.out.println('billFilessize :::::::::::: ' + billFilessize);
suc_count = 0
personnel_id = formVO.getValue('personnel_id_by_userid');
today = formVO.getValue('today')
modir_personnel_code = 2041; //modir portal
invoice_form_id = 70864;

output = '';
invoice_vals = [];
service_inner_vals = [];
service_fields_inner = [];
invoice_fields = [];
invoice_id_arr = [];
id_ = formVO.getValue('table_record_id')
//FIELDS NAME
invoice_fields.push('register_id');
//invoice_fields.push('register_date'); //today
//invoice_fields.push('account_number'); //X//Invoice THC Number
//invoice_fields.push('bill_services_type');
//invoice_fields.push('issue_date'); //issue_date
invoice_fields.push('contract_rate'); //contract_rate
invoice_fields.push('ETS_rate'); //ETS_rate
invoice_fields.push('port_name_id'); // Port
invoice_fields.push('bill_services_status'); // Invoice Status 1 sabte avalie
invoice_fields.push('account_status'); // Account Status 1 jari
//invoice_fields.push('invoice_id_ccs'); // shomare soorathesab
invoice_fields.push('second_excel_id')


//SELLER FIELDS
invoice_fields.push('seller_id'); // sina
invoice_fields.push('national_code_seller'); //
invoice_fields.push('economic_code_seller');
invoice_fields.push('seller_address');
invoice_fields.push('seller_phone'); // it's id
invoice_fields.push('registration_no_seller');
invoice_fields.push('postal_code_seller'); // it's id
invoice_fields.push('seller_fax');

//BUYER FIELDS
invoice_fields.push('buyer_id'); //Box Agent
invoice_fields.push('national_code_buyer');
invoice_fields.push('buyer_phone');
invoice_fields.push('agent_type'); //container - vessel
invoice_fields.push('buyer_fax');
invoice_fields.push('economic_code_buyer');
invoice_fields.push('buyer_address');
invoice_fields.push('postal_code_buyer');

//VOYAGE FIELDS
invoice_fields.push('vessel_id'); // Name Keshti
invoice_fields.push('vessel_type'); // Noe Keshti
//invoice_fields.push('entry_voyage_number'); // haghe jazb
invoice_fields.push('exit_voyage_number'); // paye sanavat
invoice_fields.push('origine_port_id'); //haghe maskan
invoice_fields.push('destination_port_id'); // aghlam masrafi
invoice_fields.push('on_berth_date'); // pahloogiri
invoice_fields.push('un_berth_date'); //joda shodan az eskele
invoice_fields.push('vessel_size'); //andaze keshti
invoice_fields.push('total_moves'); // tedade container
invoice_fields.push('box_operator'); //khate keshtirani

//SERVICE FIELDS
service_fields_inner.push('bill_port_services_id'); //id parent
service_fields_inner.push('service_id'); //service name
service_fields_inner.push('quantity');
service_fields_inner.push('service_tariff'); //unit fee
service_fields_inner.push('with_off');
service_fields_inner.push('amount');
service_fields_inner.push('amount_service_rial'); //unitfee * quantity

//GROSS FIELDS
invoice_fields.push('total_amount'); //Gross Total Amount
invoice_fields.push('share_operator'); //Gross Share Port
//TRANSHIPP GROSS FIELDS
invoice_fields.push('tranship_gross_amount'); //Tranship Total Amount
invoice_fields.push('operator_share_tranship'); //Tranship Share Port
//LINER DISCOUNT FIELDS
invoice_fields.push('liner_vessel_discount'); //Liner Vessel Discount Total Amount
invoice_fields.push('liner_vessel_discount_share_operator'); //Liner Vessel Discount Share Port
//PERFORMANCE FIELDS
invoice_fields.push('performance_discount'); //Performance Total Amount
invoice_fields.push('performance_discount_share_operator'); //Performance Share Port
//TRANSHIP DISCOUNT FIELDS
invoice_fields.push('tranship_discount'); //Tranship Discount Total Amount
invoice_fields.push('tranship_discount_share_operator'); //Tranship Discount Share Port
//INVOICE AMOUNT FIELDS
invoice_fields.push('invoice_amount_dollar');
invoice_fields.push('invoice_amount_contract_rial');
invoice_fields.push('invoice_amount_rial_sana');
//TAX&DUTY FIELDS
invoice_fields.push('tax_duty_amount_dollar');
invoice_fields.push('tax_duty_amount_rial');
//PAYABLE AMOUNT FIELDS
invoice_fields.push('payable_amount_dollar');
invoice_fields.push('payable_amount_rial');
invoice_fields.push('payable_amount_organization_share');
invoice_fields.push('invoice_amount_rial');
//invoice_fields.push('invoice_serial_operator');
invoice_fields.push('bill_services_id');

var start = System.currentTimeMillis();
for (var f = 0; f < billFilessize; f++) {
    if ('' + format_type == 'zip' || '' + format_type == 'ZIP') {
        biiFile_ = billFiles.get(f);
        var billFile__ = biiFile_.getFile();
    } else {
        biiFile_ = billFiles[f];
        billFile__ = biiFile_
    }
    gap = 0;
    //billFile_name = billFile__.getFileName();
    System.out.println('biiFile_ :::::::::::: ' + biiFile_)
    //System.out.println('billFile__ :::::::::::: ' + billFile__)
    mapping = ExpressionUtil.getJSONData(billFile__, 150);
    rows = mapping.getJSONArray('rows');
    columnsCount = mapping.length();
    rowCount = rows.length();
    System.out.println('rowCount ::::::: ' + rowCount)
    System.out.println('columnsCount ::::::: ' + columnsCount)
    //This Object Has Used to Store Services Row
    var service_obj = {
        s_id: [],
        service_quantity: [],
        s_tariff: [],
        with_offs: [],
        amounts: [],
        amount_rial: []
    };

    var completed = false;
    end = false;
    var row_handler = 0;
    //output = "";
    error = "";
    isThereKhata = 0;
    var has_exclusive = 0; //Baraye Tashkhise Dashtane Estesnaate Tarefe Dar Har Bandar
    var exclusive_obj = {
        shipment_name: [], //noe Estesna (saderat/tranship or ....)
        tariff_percent: [] //Darsade Sina Az in Estesna
    }

    id = formVO.getValue('table_record_id');
    result = true;
    if (rowCount >= 60) {


        //GET Data
        var agent_address_row_num = _rowFinder(rowCount, 'Agent Address:', 7, 1); // 7 is a number of column character (Exp: H column number is 7)
        var ccs_payable_amount_row_num = _rowFinder( rowCount, 'Payable Amount:', 9, 1);
        var box_agent_row_num = _rowFinder(rowCount, 'Box Agent:', 8, 1);
        var ccs_gross_amount_row_num = _rowFinder(rowCount, 'Gross Amount:', 8, 1);
        var box_agent_row2_num = _rowFinder(rowCount, 'Tel:', 8, 1);
        var vessel_row1_num = _rowFinder(rowCount, 'Vessel Name:', 1, 1);
        var vessel_row2_num = _rowFinder(rowCount, 'Exit Voyage Number:', 1, 1);
        var vessel_row3_num = _rowFinder(rowCount, 'Berthed On:', 1, 1);
        var vessel_row4_num = _rowFinder(rowCount, 'Box Operator:', 1, 1);
        var ccs_service_row_num = _rowFinder(rowCount, '1', 2, 1); //CCS THC Service First Row and janebi
        var row = rows.getJSONArray(0);
        var box_agent_row = rows.getJSONArray(box_agent_row_num);
        var box_agent_row2 = rows.getJSONArray(box_agent_row2_num);
        var vessel_row1 = rows.getJSONArray(vessel_row1_num);
        var vessel_row2 = rows.getJSONArray(vessel_row2_num);
        var vessel_row3 = rows.getJSONArray(vessel_row3_num);
        var vessel_row4 = rows.getJSONArray(vessel_row4_num);

        /*System.out.println('agent_address_row_num : '+agent_address_row_num)
        System.out.println('ccs_service_row_num : '+ccs_service_row_num)
        System.out.println('ccs_gross_amount_row_num : '+ccs_gross_amount_row_num)
        System.out.println('ccs_payable_amount_row_num : '+ccs_payable_amount_row_num)
        System.out.println('box_agent_row_num : '+box_agent_row_num)
        System.out.println('box_agent_row2_num : '+box_agent_row2_num)
        System.out.println('vessel_row1_num : '+vessel_row1_num)
        System.out.println('vessel_row2_num : '+vessel_row2_num)
        System.out.println('vessel_row3_num : '+vessel_row3_num)
        System.out.println('vessel_row4_num : '+vessel_row4_num)*/

        //var vessel_row5 = rows.getJSONArray(28);
        //ccs_service_row = GetterUtil.getInteger(31); // CCS THC Service First Row
        System.out.println('agent address: ' + getRowValue(rows.getJSONArray(agent_address_row_num), 'Agent Address:'));
        if (agent_address_row_num == 0 || ccs_service_row_num == 0 || ccs_gross_amount_row_num == 0 || ccs_payable_amount_row_num == 0 || box_agent_row_num == 0 || box_agent_row2_num == 0 || vessel_row1_num == 0 || vessel_row2_num == 0 || vessel_row3_num == 0 || vessel_row4_num == 0) {
            error += 'فرمت فایل ارسالی از نظر محل قرار گیری مقادیر در سلولهای مربوطه با استاندارد پیاده سازی شده مغایرت دارد، از بارگذاری فرمت درست فایل مورد نظر اطمینان حاصل نمایید!'
            break;
        }



        ccs_janebi_service_row = GetterUtil.getInteger(30); // CCS Janebi Service First Row
        var box_agent_type = getRowValue(box_agent_row2, 'Agent Type:');
        var title = row.getString(29);
        var box_agent_national = getRowValue(box_agent_row.getString, 'National Code:'); // Get Other Data Of Box Agent If Don't Find at Saved Records ---> search "box_info"

        var vessel_name = getRowValue(vessel_row1, 'Vessel Name:');
        var vessel_type = getRowValue(vessel_row1, 'Vessel Type:');
        var entry_voyage_number = getRowValue(vessel_row1, 'Entry Voyage Number:');
        var exit_voyage_number = getRowValue(vessel_row2, 'Exit Voyage Number:');
        var port_origin = getRowValue(vessel_row2, 'Port Of Origine:');
        var port_dest = getRowValue(vessel_row2, 'Destination Port:');
        var berthed_on = getRowValue(vessel_row3, 'Berthed On:');
        //System.out.println('berthed_on::' + berthed_on);
        var un_berth = getRowValue(vessel_row3, 'Un Berth:');
        var vessel_size = vessel_row3.getString(56 + gap);
        var total_moves = vessel_row3.getString(62 + gap);
        var box_op = getRowValue(vessel_row4, 'Box Operator:');
        var invoice_id = getRowValue(vessel_row4, 'Invoice ID:');

        var invoice_id_array = StringUtil.split('' + invoice_id, '/');
        var invoice_type_uploaded = invoice_id_array[0] //This Var is Used To Recognize Type Of Invoice
        var invoice_status = StringUtil.extractLast('' + invoice_id, '/');
        if ('' + invoice_type_uploaded == 'J') {
            invoice_id = invoice_id
        } else {
            invoice_id = 'S/' + invoice_id
        }
        System.out.println('invoice_id::' + invoice_id)
        is_exist_bill = ExpressionUtil.getInt(formVO, 'bill_port_services', 'id', 'invoice_id_ccs=\'' + invoice_id + '\'');
        System.out.println('is_exist_bill::' + is_exist_bill)
        if ((is_exist_bill > 0 && ('' + format_type == 'zip' || '' + format_type == 'ZIP')) || ('' + format_type != 'zip' && '' + format_type != 'ZIP')) {

            //If Last Digit Of invoice_id(Exp:01/77113/1096/01) Was Even Then Invoice is "Eslahie" If it was odd, Then Invoice is "Jari".
            if (invoice_status % 2 == 0) {
                account_status = 2;
                //var add_row = 20; // this value add to last row of sazman service row to find first sina service row
            } else {
                account_status = 1;
                //var add_row = 35;
            }
            is_duplicate = ExpressionUtil.getCount(formVO, 'bill_port_services', 'invoice_id_ccs = \'' + invoice_id + '\' AND seller_id is not null')
            not_saved_duplicate = invoice_id_arr.indexOf('' + invoice_id)
            //System.out.println(':not_saved_duplicate:' + not_saved_duplicate + ':L: invoice_id:' + invoice_id + ' is_duplicate : '+is_duplicate)
            if (not_saved_duplicate != -1) {
                isThereKhata += 1;
                output += 'صورتحسابی با Invoice ID : ' + invoice_id + ' قبل تر در سیستم وارد شده است. (تکرار در یک فایل)\n';
                continue;
            }
            if (is_duplicate > 0) {
                isThereKhata += 1;
                output += ' صورتحسابی با "شماره صورت حساب ' + invoice_id + ' CCS" در سیستم وجود دارد. (صورتحساب تکراری)\n';
                continue;
            }

            if ('' + invoice_type_uploaded == 'J') {
                var bill_services_type = 2;
                var sina_service_row_num = _rowFinder(rowCount, '1', 2, 1);
                var sina_gross_amount_row_num = _rowFinder(rowCount, 'Gross Amount:', 8, 1);
                var sina_invoice_amount_row_num = _rowFinder(rowCount, 'Invoice Amount:', 9, 1);
                var invoice_compare_part = '' + invoice_id_array[2] + '' + invoice_id_array[3]; // This Var is Used to Find Same Invoice in Other Status
                FindOldInvoiceWhere = "split_part(invoice_id_ccs,'/',3) || split_part(invoice_id_ccs,'/',4)"; // This Var is Used to Search Invoices in DB -> search "last_invoice" to findout what we did
                var row_invoice_number = rows.getJSONArray(10);
                //System.out.println('row_invoice_number:' + row_invoice_number);
                var invoice_thc_number = getRowValue(row_invoice_number, '');
                var row_dates = rows.getJSONArray(2);
                //System.out.println('invoice_thc_number:' + invoice_thc_number)
                var row_ets_rate = rows.getJSONArray(6);
                var issue_date_miladi = row_dates.getString(52 + gap);
                var contract_rate = StringUtil.replace('' + row_ets_rate.getString(59 + gap), ',', '')
                var ETS_rate = row_ets_rate.getString(59 + gap);
                var port = rows.getJSONArray(8);
                //System.out.println('port:' + port);
                var port_name = port.getString(19);
                port_name = StringUtil.replace('' + port_name, ' ', '')
                port_name = ExpressionUtil.stringSQL(formVO, 'SELECT upper(\'' + port_name + '\')')
                port_id = ExpressionUtil.getInt(formVO, 'ports_info', 'id', 'replace(upper(english_name),\' \',\'\') = \'' + port_name + '\'')

                if (port_id == 0) {
                    if ('' + StringUtil.extractFirst('' + port_name, 'EHR') == 'BUSH') { // chon moshkeli dar hazfe fasele beyne bushehr va port dashtim majbur shodim az in ravesh baraye bushehr estefade konim
                        port_id = 601;
                    } else {
                        output += 'لطفا بررسی نمایید که بندر ثبت شده در شماره صورت حساب ' + invoice_id + ' در لیست بنادر وجود داشته باشد.صورت حساب ثبت نشد\n';
                        isThereKhata += 1;
                        continue;
                    }
                }

                sina_share_percent = ExpressionUtil.getDouble(formVO, 'terminal_info', 'operator_share', 'port_id = ' + port_id + ' and status_ = 1 and end_date >= \'' + berthed_on + '\' and start_date <= \'' + berthed_on + '\' and services_ = 2') //nerkhe sabet shame sina
                if (GetterUtil.getDouble(sina_share_percent) == 0) {
                    sina_share_percent = 100;
                }
                share_difference_rate = ExpressionUtil.getDouble(formVO, 'terminal_info', 'operator_share_difference_rate', 'port_id = ' + port_id + ' and status_ = 1 and end_date >= \'' + berthed_on + '\' and start_date <= \'' + berthed_on + '\' and services_ = 2') //nerkhe moteghayer shame sina
                //System.out.println('share_difference_rate::' + share_difference_rate + ':: sina_share_percent::' + sina_share_percent)
                if (GetterUtil.getDouble(share_difference_rate) == 0) {
                    share_difference_rate = 1;
                } else {
                    share_difference_rate = GetterUtil.getDouble((share_difference_rate / 100))
                }

                var calculate_formula = (sina_share_percent / 100) //Used for Riali Amount of Services
            } else {
                var bill_services_type = 1;
                var sina_service_row_num = _rowFinder(rowCount, '1', 2, 2);
                var sina_gross_amount_row_num = _rowFinder(rowCount, 'Gross Amount:', 8, 2);
                var sina_invoice_amount_row_num = _rowFinder(rowCount, 'Invoice Amount:', 9, 2);
                var invoice_compare_part = '' + invoice_id_array[1] + '' + invoice_id_array[2];
                FindOldInvoiceWhere = "split_part(invoice_id_ccs,'/',3) || split_part(invoice_id_ccs,'/',4)";
                var row_invoice_number = rows.getJSONArray(2);
                var invoice_thc_number = row_invoice_number.getString(51 + gap);
                var row_dates = rows.getJSONArray(6);
                var row_contract_rate = rows.getJSONArray(8);
                var row_ets_rate = rows.getJSONArray(10);
                var issue_date_miladi = row_dates.getString(52 + gap);
                if ('' + issue_date_miladi == '') {
                    var issue_date_miladi = row_dates.getString(53 + gap);
                }
                var contract_rate = StringUtil.replace('' + row_contract_rate.getString(59 + gap), ',', '')
                var ETS_rate = row_ets_rate.getString(59 + gap);
                var port = rows.getJSONArray(12);
                var port_name = port.getString(19);
                if ('' + port_name == '') {
                    var port_name = port.getString(20);
                }
                port_name = StringUtil.replace('' + port_name, ' ', '')
                port_name = ExpressionUtil.stringSQL(formVO, 'SELECT upper(\'' + port_name + '\')')
                port_id = ExpressionUtil.getInt(formVO, 'ports_info', 'id', 'replace(upper(english_name),\' \',\'\') = \'' + port_name + '\'')
                if (port_id == 0) {
                    if ('' + StringUtil.extractFirst('' + port_name, 'EHR') == 'BUSH') {
                        port_id = 601;
                    } else {
                        output += 'لطفا بررسی نمایید که بندر ثبت شده در شماره صورت حساب ' + invoice_id + ' در لیست بنادر وجود داشته باشد.صورت حساب ثبت نشد\n';
                        isThereKhata += 1;
                        continue;
                    }
                }
                System.out.println('port_id : ' + port_id + ' berthed_on : ' + berthed_on)
                sina_share_percent = ExpressionUtil.getDouble(formVO, 'terminal_info', 'operator_share', 'port_id = ' + port_id + ' and status_ = 1 and end_date >= \'' + berthed_on + '\' and start_date <= \'' + berthed_on + '\' and services_ = 1')
                //System.out.println('sina_share_percent+++++++++++++++ : ->' + GetterUtil.getDouble(sina_share_percent))
                if (GetterUtil.getDouble(sina_share_percent) == 0) {
                    sina_share_percent = 100;
                }
                share_difference_rate = ExpressionUtil.getDouble(formVO, 'terminal_info', 'operator_share_difference_rate', 'port_id = ' + port_id + ' and status_ = 1 and end_date >= \'' + berthed_on + '\' and start_date <= \'' + berthed_on + '\' and services_ = 1')
                //System.out.println('share_difference_rate::' + share_difference_rate + ':: sina_share_percent::' + sina_share_percent)
                if (GetterUtil.getDouble(share_difference_rate) == 0) {
                    share_difference_rate = 1;
                } else {
                    share_difference_rate = GetterUtil.getDouble((share_difference_rate / 100))
                }

                var calculate_formula = (sina_share_percent / 100)
                // System.out.println('calculate_formula1111 : ->' + calculate_formula)
                //System.out.println('sina_share_percent : ->' + sina_share_percent)
            }
            // ----------HOW TO FIND CCS SERVICES ROW
            while (!end) {
                if (bill_services_type == 2) {
                    //be dalile tafavot dar formate excel janebi va thc ma dar khadamate janebi service ro dar hamoon bare aval k dide mishe migirim
                    var ccs_service_title = rows.getJSONArray(ccs_service_row_num);
                    var ccs_item_number = ccs_service_title.getString(2);
                    var item_number = GetterUtil.getInteger(ccs_service_title.getString(2));
                    var service_name = ccs_service_title.getString(5);
                    var quantity_ = GetterUtil.getInteger(ccs_service_title.getString(35));
                    var unit_fee = GetterUtil.getDouble(ccs_service_title.getString(40));
                    var with_off = GetterUtil.getDouble(ccs_service_title.getString(47));
                    var amount = GetterUtil.getDouble(ccs_service_title.getString(55));
                    if (amount == 0) {
                        amount = GetterUtil.getDouble(ccs_service_title.getString(56));
                    }
                    //System.out.println('ccs_service_title+++++ :' + ccs_service_title)
                    if (item_number == 0 && (ccs_service_row_num != 30 && ccs_service_row_num != 31)) {
                        end = true;
                        break;
                    } else if (item_number != 0) {
                        service_id = ExpressionUtil.getInt(formVO, 'port_services', 'id', 'service_type = 2 and service_title_eng = \'' + service_name + '\'')
                        if (service_id == 0) {
                            var service_form_id = 70247;
                            var service_fields = ['register_date', 'register_id', 'service_type', 'service_title_eng', 'service_status', 'insert_by_system'];
                            var service_values = ['' + today, '' + modir_personnel_code, '2', '' + service_name, '1', '1'];
                            var master_service_id = 0;
                            var service_id = my_insert(service_form_id, service_fields, service_values, master_service_id, false)
                        }
                        service_obj.s_id.push(service_id);
                        service_obj.service_quantity.push(quantity_);
                        service_obj.s_tariff.push(unit_fee);
                        service_obj.with_offs.push(with_off);
                        service_obj.amounts.push(amount);
                        amount_rial_service = GetterUtil.getDouble(amount) * GetterUtil.getDouble(contract_rate); //agar darsade sina dar banadare mokhtalef baraye janebi motefavet bashad in formul bayad avaz shavad
                        service_obj.amount_rial.push(ExpressionUtil.roundOff(amount_rial_service, 0));
                        //System.out.println('amount_rial_service:' + amount_rial_service + '::::amount_rial_service_round::' + ExpressionUtil.roundOff(amount_rial_service, 0))
                    }
                    if (item_number == 1) {
                        ccs_service_row_num += 2;
                    } else {
                        ccs_service_row_num += 1;
                    }
                }
                if (ccs_item_number == '' || ccs_item_number == null) {
                    end = true;
                    break;
                }
            }

            //baraye peyda kardane sahme sazman dar THC bayad ccs_service_row + 15 bokonim ama dar janebi be elate tafavot dar sakhtar excel bayad + 17 bokonim
            if (bill_services_type == 1) {
                var css_payable_row = rows.getJSONArray(ccs_payable_amount_row_num);
                if (account_status == 1) {
                    var ccs_payable_amount = ExpressionUtil.round(StringUtil.replace(css_payable_row.getString(31), ',', ''))
                } else {
                    //manfi kardane adade pardakhti dar surathesabe eslahi
                    var ccs_payable_amount = GetterUtil.getLong('-' + ExpressionUtil.round(StringUtil.replace(StringUtil.extractFirst(css_payable_row.getString(31), '-'), ',', '')));
                }
                var css_share_row = rows.getJSONArray(ccs_gross_amount_row_num); // Daryafte Sahme Sazman baraye ink dar surathesab zakhire konim
                var ccs_share = css_share_row.getString(39);
            } else {
                var ccs_payable_amount = 0; //All of This Earning Type, Belongs To Seller (sina)
            }

            var sina_service_row = sina_service_row_num;

            //CONVERT DATA ------>START
            issue_date_miladi = StringUtil.split('' + issue_date_miladi, ' ')[0]
            ETS_rate = StringUtil.replace('' + ETS_rate, ',', '')
            berthed_on = StringUtil.split('' + berthed_on, ' ')[0]
            //Barresie Vojude Estesnaate Tarefe Baraye in Bandar
            //System.out.println('berthed_on :-> ' +berthed_on)
            exclusive_tariifs_port = ExpressionUtil.executeSQL(formVO, 'SELECT st.eng_title,et.sina_share FROM exceptions_tariffs et join shipment_type st on st.id = et.shipment_type_id WHERE et.active = 1 and et.end_date >= \'' + berthed_on + '\' and et.start_date <= \'' + berthed_on + '\' AND port_id =' + port_id);
            if (exclusive_tariifs_port.size() > 0) {
                has_exclusive = 1;
                for (z = 0; z < exclusive_tariifs_port.size(); z++) {
                    exclusive_obj.shipment_name.push(exclusive_tariifs_port.get(z)[0]);
                    exclusive_obj.tariff_percent.push(exclusive_tariifs_port.get(z)[1]);
                }
            }

            vessel_id = ExpressionUtil.getInt(formVO, 'vessels_info', 'id', 'upper(vessel_name) = \'' + StringUtil.upperCase(vessel_name) + '\'');
            if (vessel_id == 0) {
                vessel_form_id = 70634;
                fields_array = ['registrar_id', 'register_date', 'vessel_name', 'vessel_type', 'status_'];
                values_array = ['' + modir_personnel_code, '' + today, '' + vessel_name, '\'' + vessel_type + '\'', '1'];
                vessel_id = my_insert(vessel_form_id, fields_array, values_array, 0, false)
            }
            berthed_on = StringUtil.split('' + berthed_on, ' ')[0]
            un_berth = StringUtil.split('' + un_berth, ' ')[0]

            //Get Box Agent Data ---->>>> Daryafte Etelaate Keshtirani
            box_info = ExpressionUtil.executeSQL(formVO, 'SELECT id,en_company_name,phone_number,fax_number,address_,economic_code,postal_code,zinaff_type FROM shipping_companies WHERE national_id = \'' + box_agent_national + '\'')
            if (box_info.size() > 0) {
                co_id = box_info.get(0)[0];
                co_name = box_info.get(0)[1];
                co_tel = box_info.get(0)[2];
                co_fax = box_info.get(0)[3];
                co_address = box_info.get(0)[4];
                co_economic_code = box_info.get(0)[5];
                co_postal_code = box_info.get(0)[6];
                co_zinaff_type = box_info.get(0)[7];
                if ('' + co_zinaff_type == '') {
                    ExpressionUtil.update(formVO, 'shipping_companies', 'zinaff_type', '1', 'id = ' + co_id)
                } else if ('' + co_zinaff_type != '' && !StringUtil.contains('' + co_zinaff_type, '1', ',')) {
                    ExpressionUtil.update(formVO, 'shipping_companies', 'zinaff_type', '1,' + co_zinaff_type, 'id = ' + co_id)
                }
            } else {
                var box_agent_row3 = rows.getJSONArray(22);
                var box_agent_row4 = rows.getJSONArray(23);
                var co_name = box_agent_row.getString(18);
                var co_tel = box_agent_row2.getString(17);
                var co_fax = box_agent_row3.getString(14);
                var co_economic_code = box_agent_row3.getString(55 + gap);
                var co_address = box_agent_row4.getString(17);
                var co_postal_code = box_agent_row4.getString(54 + gap);
                var shipping_form_id = 70498;
                fields_array = ['registrar_id', 'register_date', 'national_id', 'en_company_name', 'fax_number', 'address_', 'economic_code', 'postal_code', 'phone_number', 'status_', 'zinaff_type'];
                values_array = ['' + modir_personnel_code, '' + today, '' + box_agent_national, '' + co_name, '\'' + co_fax + '\'', '\'' + co_address + '\'', '\'' + co_economic_code + '\'', '\'' + co_postal_code + '\'', '\'' + co_tel + '\'', '1', '1'];
                var co_id = my_insert(shipping_form_id, fields_array, values_array, 0, false)
            }

            // Getting Shipping Line Data
            box_op_id = ExpressionUtil.getInt(formVO, 'shipping_line', 'id', 'upper(line_name) = \'' + StringUtil.upperCase(box_op) + '\' and shipping_id = ' + co_id)
            if (box_op_id == 0) {
                var shipping_line_form_id = 71095;
                var box_op_fields = ['shipping_id', 'line_name', 'status_'];
                var box_op_values = ['' + co_id, '' + box_op, '1'];
                var box_op_id = my_insert(shipping_line_form_id, box_op_fields, box_op_values, co_id, false)
            }

            // Handle Port Orgin and Port Destination
            port_or_id = ExpressionUtil.getInt(formVO, 'ports_origin_destination', 'id', 'upper(english_name) = \'' + StringUtil.upperCase(port_origin) + '\'')
            if (port_or_id == 0) {
                var port_form_id = 72429;
                var port_or_fields = ['registrar_id', 'register_date', 'english_name'];
                var port_or_values = ['' + modir_personnel_code, '' + today, '\'' + port_origin + '\''];
                var port_or_id = my_insert(port_form_id, port_or_fields, port_or_values, 0, false)
            }
            port_dest_id = ExpressionUtil.getInt(formVO, 'ports_origin_destination', 'id', 'upper(english_name) = \'' + StringUtil.upperCase(port_dest) + '\'')
            if (port_dest_id == 0 && '' + StringUtil.upperCase(port_origin) != '' + StringUtil.upperCase(port_dest)) {
                var port_form_id = 72429;
                var port_des_fields = ['registrar_id', 'register_date', 'english_name'];
                var port_des_values = ['' + modir_personnel_code, '' + today, '\'' + port_dest + '\''];
                var port_dest_id = my_insert(port_form_id, port_des_fields, port_des_values, 0, false)
            } else if (port_dest_id == 0 && '' + StringUtil.upperCase(port_origin) == '' + StringUtil.upperCase(port_dest)) {
                port_dest_id = port_or_id;
            }

            //GET SINA DATA As a Seller - in query mitune dar ayande behine beshe chon seller hamishe sina hastesh va yekbar ejraye oun mitune kafi bashe baraye hameye excelha - bayad bere balaye for
            sina_data = ExpressionUtil.executeSQL(formVO, 'SELECT id,company_title,national_id,economic_code,address_,phone_number,registration_no,postal_code,fax_number FROM employment.company WHERE id = 4')
            if (sina_data.size() > 0) {
                op_id = sina_data.get(0)[0];
                op_name = sina_data.get(0)[1];
                op_national_id = sina_data.get(0)[2];
                op_eco_code = sina_data.get(0)[3];
                op_address = sina_data.get(0)[4];
                op_tel = sina_data.get(0)[5];
                op_reg_no = sina_data.get(0)[6];
                op_post_code = sina_data.get(0)[7];
                op_fax = sina_data.get(0)[8];
            } else {
                isThereKhata += 1;
                output += 'شرکت سینا در لیست شرکت ها یافت نشد صورت حساب با شماره ' + invoice_id + 'ثبت نشد.\n'
                continue;
            }

            //----------HOW TO FIND Sina SERVICES ROW -- GET Services Data (Sahme Sina)
            if (bill_services_type == 1) {
                var sina_service_row = sina_service_row_num;
                while (!completed) {
                    calculate_formula = (sina_share_percent / 100);
                    sina_service_row = GetterUtil.getInteger(sina_service_row) + row_handler;
                    var services_row = rows.getJSONArray(sina_service_row);
                    var item_number = GetterUtil.getInteger(services_row.getString(2));
                    var service_name = services_row.getString(5);
                    var quantity_ = GetterUtil.getInteger(services_row.getString(35));
                    var unit_fee = GetterUtil.getDouble(services_row.getString(40));
                    var with_off = GetterUtil.getDouble(services_row.getString(47));
                    var amount = GetterUtil.getDouble(services_row.getString(55));
                    if (amount == 0) {
                        amount = GetterUtil.getDouble(services_row.getString(56));
                    }
                    if (item_number == 0 && row_handler != 0) {
                        completed = true;
                        break;
                    } else if (item_number != 0) {
                        service_id = ExpressionUtil.getInt(formVO, 'port_services', 'id', 'service_type = 1 and service_title_eng = \'' + service_name + '\'')
                        if (service_id == 0 && bill_services_type == 1) {
                            var service_form_id = 70247;
                            var service_fields = ['register_date', 'register_id', 'service_type', 'service_title_eng', 'service_status', 'insert_by_system'];
                            var service_values = ['' + today, '' + modir_personnel_code, '1', '' + service_name, '1', '1'];
                            var master_service_id = 0;
                            var service_id = my_insert(service_form_id, service_fields, service_values, master_service_id, false)
                        }
                        if (StringUtil.contains('' + service_name, 'Export', '') && StringUtil.contains('' + service_name, 'Full', '')) {
                            container_type = ExpressionUtil.getInt(formVO, 'port_services', 'container_type', 'id = ' + service_id);
                            filter = '';
                            if (container_type > 0) {
                                filter = ' AND container_type_id = ' + container_type
                            }
                            percent = ExpressionUtil.getDouble(formVO, 'container_operation_specifications', 'discount', 'shipment_type_id =2 AND container_mode=1 ' + filter + ' AND port_service_tariff_id in (SELECT id from port_service_tariff WHERE port_id =' + port_id + ' AND \'' + berthed_on + '\' between start_date and end_date) and container_operation_status = 1');
                            //System.out.println('percent >>>>>>>>>>>>>>>>>>' + percent)
                            if (percent > 0) {
                                percent = percent
                            } else {
                                percent = 100
                            }
                            has_exclusive = 1;
                            exclusive_obj.shipment_name.push('Export');
                            exclusive_obj.tariff_percent.push(percent);
                        }
                        service_obj.s_id.push(service_id);
                        service_obj.service_quantity.push(quantity_);
                        service_obj.s_tariff.push(unit_fee);
                        service_obj.with_offs.push(with_off);
                        service_obj.amounts.push(amount);

                        //Common Part of Calculate Riali Amount Formula
                        //total_amount = (GetterUtil.getDouble(amount) * GetterUtil.getDouble(contract_rate)) + (GetterUtil.getDouble(amount) * (GetterUtil.getDouble(ETS_rate) - GetterUtil.getDouble(contract_rate)) * share_difference_rate)
                        // System.out.println('service_name :-> ' +service_name)
                        //System.out.println('has_exclusive :-> ' +has_exclusive)
                        total_contract_rate = (GetterUtil.getDouble(amount) * GetterUtil.getDouble(contract_rate))
                        //System.out.println('total_contract_rate :-> ' +total_contract_rate)
                        //System.out.println('cal_cal_cal :-> '+calculate_formula)
                        total_sana_difference_rate = (GetterUtil.getDouble(amount) * (GetterUtil.getDouble(ETS_rate) - GetterUtil.getDouble(contract_rate)) * share_difference_rate)
                        //System.out.println('total_sana_difference_rate :-> ' +total_sana_difference_rate)
                        //System.out.println('total_contract_rate >>>>>>>>>>>>>>>>>>' + total_contract_rate + 'total_sana_difference_rate::::' + total_sana_difference_rate)
                        if (has_exclusive > 0) {
                            for (p = 0; p < exclusive_obj.shipment_name.length; p++) {
                                //System.out.println(' exclusive_obj.shipment_name[p] >>>>>>>>>>>>>>>>>>' + exclusive_obj.tariff_percent[p])
                                //System.out.println(' exclusive_obj.shipment_name[p] >>>>>>>>>>>>>>>>>>' + exclusive_obj.shipment_name[p])
                                if (StringUtil.contains('' + service_name, 'Export', '') && '' + exclusive_obj.shipment_name[p] == 'Export') {
                                    has_tariff = StringUtil.contains('' + service_name, 'Full', '')
                                } else {
                                    // in ghesmat code behiineii neveshte nashode chera k shayad yerooz estesnae tarefe yechizi be gheyr az tranship bashe
                                    has_tariff = StringUtil.contains('' + service_name, '' + exclusive_obj.shipment_name[p], '')
                                    if (has_tariff == true && StringUtil.contains('' + service_name, 'Tranship', '')) {
                                        calculate_formula = 1; // baraye fahme bnehtar be khate 331 o 506 morajee shavad
                                    }
                                }
                                //System.out.println('exclusive_obj.shipment_name.toString : ->' + exclusive_obj.shipment_name.toString())
                                //System.out.println('has_tariff : ->' + has_tariff)
                                if (has_tariff) {
                                    exclusive_percent = exclusive_obj.tariff_percent[p];
                                    //System.out.println('exclusive_percent : ->' + exclusive_percent)
                                    //System.out.println('exclusive_name : ->' + exclusive_obj.shipment_name[p])
                                    //System.out.println('GetterUtil.getDouble(calculate_formula) : ->' + GetterUtil.getDouble(calculate_formula))
                                    total_contract_rate = total_contract_rate * (GetterUtil.getDouble(exclusive_percent) / 100) * GetterUtil.getDouble(calculate_formula);
                                    //System.out.println('total_contract_rateexxx : ->' + total_contract_rate)
                                    if (port_id == 601) {
                                        calculate_formula = 1; // chon dar bushehr mohasebe sahme sina baraye ekhtelafe sana va sabet az kolle mablaghe factor 50 darsadmigirad na az sahme khodesh
                                    }
                                    if ('' + berthed_on >= '2023-06-05') {
                                        total_sana_difference_rate = total_sana_difference_rate * (GetterUtil.getDouble(exclusive_percent) / 100);
                                    } else {
                                        total_sana_difference_rate = total_sana_difference_rate * (GetterUtil.getDouble(exclusive_percent) / 100) * GetterUtil.getDouble(calculate_formula);
                                    }
                                    //System.out.println('calculate_formulaxxxxxxxx : ->' + GetterUtil.getDouble(calculate_formula))
                                    //System.out.println('total_sana_difference_ratexxx : ->' + total_sana_difference_rate)
                                    //total_amount = (total_amount * (GetterUtil.getDouble(exclusive_percent) / 100)) * GetterUtil.getDouble(calculate_formula);
                                    total_amount = GetterUtil.getDouble(total_contract_rate) + GetterUtil.getDouble(total_sana_difference_rate);
                                    //System.out.println('total_amount >>>>>>>>>>>>>>>>>>'+total_amount)
                                    //System.out.println('exclusive_percent >>>>>>>>>>>>>>>>>>'+exclusive_percent)
                                    break;
                                } else if (p == GetterUtil.getInteger(exclusive_obj.shipment_name.length) - 1) {
                                    //System.out.println('chandbar >>>>>>>>>>>>>>>>>>'+p)
                                    total_contract_rate = total_contract_rate * GetterUtil.getDouble(calculate_formula);
                                    if (port_id == 601) {
                                        calculate_formula = 1;
                                    }
                                    if ('' + berthed_on >= '2023-06-05') {
                                        total_sana_difference_rate = total_sana_difference_rate;
                                    } else {
                                        total_sana_difference_rate = total_sana_difference_rate * GetterUtil.getDouble(calculate_formula);
                                    }
                                    //total_amount = total_amount * GetterUtil.getDouble(calculate_formula);
                                    total_amount = GetterUtil.getDouble(total_contract_rate) + GetterUtil.getDouble(total_sana_difference_rate);
                                }
                            }
                        } else {
                            total_contract_rate = total_contract_rate * GetterUtil.getDouble(calculate_formula);
                            if (port_id == 601) {
                                calculate_formula = 1;
                            }
                            if ('' + berthed_on >= '2023-06-05') {
                                total_sana_difference_rate = total_sana_difference_rate;
                            } else {
                                total_sana_difference_rate = total_sana_difference_rate * GetterUtil.getDouble(calculate_formula);
                            }
                            //total_amount = total_amount * GetterUtil.getDouble(calculate_formula);
                            total_amount = GetterUtil.getDouble(total_contract_rate) + GetterUtil.getDouble(total_sana_difference_rate);
                        }
                        //System.out.println('total_sana_difference_rate2222222 >>>>>>>>>>>>>>>>>>' + total_sana_difference_rate)
                        //System.out.println('total_contract_rate22222222222 >>>>>>>>>>>>>>>>>>' + total_contract_rate)
                        //System.out.println('calculate_formula22222222222 >>>>>>>>>>>>>>>>>>' + calculate_formula)
                        total_amount = ExpressionUtil.roundOff(total_amount, 0)
                        //System.out.println('total_amountEND : ->' + total_amount)
                        service_obj.amount_rial.push(total_amount);
                    }
                    if ((row_handler == 0 || row_handler == 1) && item_number == 1) {
                        row_handler = 2;
                    } else {
                        row_handler = 1;
                    }
                }
            }

            var gross_row = rows.getJSONArray(sina_gross_amount_row_num);
            var gross_total = GetterUtil.getDouble(StringUtil.replace(gross_row.getString(21), ',', ''))
            var gross_share = GetterUtil.getDouble(StringUtil.replace(gross_row.getString(38), ',', ''))
            var tranship_row = rows.getJSONArray(sina_gross_amount_row_num + 2);
            var liner_row = rows.getJSONArray(sina_gross_amount_row_num + 4);
            var performance_row = rows.getJSONArray(sina_gross_amount_row_num + 6);
            var tranship_dis_row = rows.getJSONArray(sina_gross_amount_row_num + 7);
            var invoice_amount_row = rows.getJSONArray(sina_gross_amount_row_num + 11);
            var tranship_total = GetterUtil.getDouble(StringUtil.replace(tranship_row.getString(21), ',', ''))
            var tranship_share = GetterUtil.getDouble(StringUtil.replace(tranship_row.getString(38), ',', ''))
            var liner_total = GetterUtil.getDouble(StringUtil.replace(liner_row.getString(21), ',', ''))
            var liner_share = GetterUtil.getDouble(StringUtil.replace(liner_row.getString(38), ',', ''))
            var performance_total = GetterUtil.getDouble(StringUtil.replace(performance_row.getString(21), ',', ''))
            var performance_share = GetterUtil.getDouble(StringUtil.replace(performance_row.getString(38), ',', ''))
            var tranship_dis_total = GetterUtil.getDouble(StringUtil.replace(tranship_dis_row.getString(21), ',', ''))
            var tranship_dis_share = GetterUtil.getDouble(StringUtil.replace(tranship_dis_row.getString(38), ',', ''))
            var price_dollar = GetterUtil.getDouble(StringUtil.replace(invoice_amount_row.getString(21), ',', ''))
            var contract_rial = StringUtil.replace(invoice_amount_row.getString(28), ',', '')
            var sana_rial = StringUtil.replace(invoice_amount_row.getString(38), ',', '')
            if ('' + sana_rial == '') {
                var sana_rial = StringUtil.replace(invoice_amount_row.getString(39), ',', '')
            }
            var tax_row = rows.getJSONArray(sina_gross_amount_row_num + 12);
            //var payable_row = rows.getJSONArray(sina_gross_amount_row_num + 13);
            var tax_dollar = GetterUtil.getDouble(StringUtil.replace(tax_row.getString(21), ',', ''))
            if (tax_dollar == 0) {
                var tax_row = rows.getJSONArray(sina_gross_amount_row_num + 13);
                //var payable_row = rows.getJSONArray(sina_gross_amount_row_num + 15);
                var tax_dollar = GetterUtil.getDouble(StringUtil.replace(tax_row.getString(21), ',', ''))
            }
            var tax_rial = ExpressionUtil.round(StringUtil.replace(tax_row.getString(29), ',', ''))
            if (tax_rial == 0) {
                //var payable_row = rows.getJSONArray(sina_gross_amount_row_num + 15);
                var tax_row = rows.getJSONArray(sina_gross_amount_row_num + 13);
                //System.out.println(':tax_row::' + tax_row)
                var tax_rial = ExpressionUtil.round(StringUtil.replace(tax_row.getString(30), ',', ''))
            }
            var payable_row = rows.getJSONArray(sina_gross_amount_row_num + 15);

            if (account_status == 1) {
                var payable_dollar = GetterUtil.getDouble(StringUtil.replace(payable_row.getString(21), ',', ''));
                if (payable_dollar == 0) {
                    var payable_row = rows.getJSONArray(sina_gross_amount_row_num + 14);
                    var payable_dollar = GetterUtil.getDouble(StringUtil.replace(payable_row.getString(21), ',', ''));
                    if (payable_dollar == 0) {
                        var payable_row = rows.getJSONArray(sina_gross_amount_row_num + 13);
                        var payable_dollar = GetterUtil.getDouble(StringUtil.replace(payable_row.getString(21), ',', ''));
                    }
                }
                var payable_rial = ExpressionUtil.round(StringUtil.replace(payable_row.getString(29), ',', ''));
            } else {
                var payable_dollar = GetterUtil.getDouble('-' + StringUtil.replace(StringUtil.extractFirst(payable_row.getString(21), '-'), ',', ''))
                if (payable_dollar == 0) {
                    var payable_row = rows.getJSONArray(sina_gross_amount_row_num + 14);
                    var payable_dollar = GetterUtil.getDouble('-' + StringUtil.replace(StringUtil.extractFirst(payable_row.getString(21), '-'), ',', ''));
                    if (payable_dollar == 0) {
                        var payable_row = rows.getJSONArray(sina_gross_amount_row_num + 13);
                        var payable_dollar = GetterUtil.getDouble('-' + StringUtil.replace(StringUtil.extractFirst(payable_row.getString(21), '-'), ',', ''));
                    }
                }
                var payable_rial = GetterUtil.getDouble('-' + ExpressionUtil.round(StringUtil.replace(StringUtil.extractFirst(payable_row.getString(29), '-'), ',', '')));
            }

            //System.out.println('tax_rial+++++ :' + tax_rial + 'tax_dollar+++++ :' + tax_dollar + 'tranship_total+++++ :' + tranship_total + 'tranship_share+++++ :' + tranship_share + 'contract_rial+++++ :' + contract_rial + ' payable_dollar:::::::::::::::::::--->>>' + payable_dollar)

            invoice_form_id = 70820;
            invoice_vals.push('\'' + personnel_id + '\'')
            //invoice_vals.push('\'' + today + '\'')
            //invoice_vals.push('x')
            //invoice_vals.push(bill_services_type)
            //invoice_vals.push('\'' + issue_date_miladi + '\'')
            invoice_vals.push(contract_rate)
            invoice_vals.push(ETS_rate)
            invoice_vals.push(port_id)
            invoice_vals.push('1') //bill_services_status
            invoice_vals.push(account_status) //account_status
            invoice_vals.push(id_)
            //invoice_vals.push('\'' + invoice_id + '\'')
            invoice_vals.push(op_id) //seller_id
            invoice_vals.push('\'' + op_national_id + '\'') //national_code_seller
            invoice_vals.push('\'' + op_eco_code + '\'') //economic_code_seller
            invoice_vals.push('\'' + op_address + '\'') //seller_address
            invoice_vals.push('\'' + op_tel + '\'') //seller_phone
            invoice_vals.push('\'' + op_reg_no + '\'') //registration_no_seller
            invoice_vals.push('\'' + op_post_code + '\'') //postal_code_seller
            invoice_vals.push('\'' + op_fax + '\'') //seller_fax
            invoice_vals.push(co_id) //buyer_id
            invoice_vals.push('\'' + box_agent_national + '\'') //national_code_buyer
            invoice_vals.push('\'' + co_tel + '\'') //buyer_phone
            invoice_vals.push('\'' + bill_services_type + '\'') //agent_type
            invoice_vals.push('\'' + co_fax + '\'') //buyer_fax
            invoice_vals.push('\'' + co_economic_code + '\'') //economic_code_buyer
            invoice_vals.push('\'' + co_address + '\'') //buyer_address
            invoice_vals.push('\'' + co_postal_code + '\'') //postal_code_buyer
            invoice_vals.push(vessel_id) //vessel_id
            invoice_vals.push('\'' + vessel_type + '\'') //vessel_type
            //invoice_vals.push('\'' + entry_voyage_number + '\'') //entry_voyage_number
            invoice_vals.push('\'' + exit_voyage_number + '\'') //exit_voyage_number
            invoice_vals.push(port_or_id) //origine_port_id
            invoice_vals.push(port_dest_id) //destination_port_id
            invoice_vals.push('\'' + berthed_on + '\'') //on_berth_date
            invoice_vals.push('\'' + un_berth + '\'') //un_berth_date
            invoice_vals.push(vessel_size) //vessel_size
            invoice_vals.push(total_moves) //total_moves
            invoice_vals.push(box_op_id) //box_operator
            invoice_vals.push(gross_total) //total_amount
            invoice_vals.push(gross_share) //share_operator
            invoice_vals.push(tranship_total) //tranship_gross_amount
            invoice_vals.push(tranship_share) //operator_share_tranship
            invoice_vals.push(liner_total) //liner_vessel_discount
            invoice_vals.push(liner_share) //liner_vessel_discount_share_operator
            invoice_vals.push(performance_total) //performance_discount
            invoice_vals.push(performance_share) //performance_discount_share_operator
            invoice_vals.push(tranship_dis_total) //tranship_discount
            invoice_vals.push(tranship_dis_share) //tranship_discount_share_operator
            invoice_vals.push(price_dollar) //invoice_amount_dollar
            invoice_vals.push(ExpressionUtil.round(contract_rial)) //invoice_amount_contract_rial
            invoice_vals.push(ExpressionUtil.round(sana_rial)) //invoice_amount_rial_sana
            invoice_vals.push(tax_dollar) //tax_duty_amount_dollar
            invoice_vals.push(tax_rial) //tax_duty_amount_rial
            invoice_vals.push(payable_dollar) //payable_amount_dollar
            invoice_vals.push(payable_rial) //payable_amount_rial
            invoice_vals.push(ccs_payable_amount) //ccs payable amount
            invoice_vals.push(ExpressionUtil.round(GetterUtil.getDouble(sana_rial) + GetterUtil.getDouble(contract_rial))) //invoice_amount_rial

            //invoice_vals.push('\'' + invoice_thc_number + '\'')

            last_invoice = ExpressionUtil.getInt(formVO, 'bill_port_services', 'id', '' + FindOldInvoiceWhere + ' = \'' + invoice_compare_part + '\' and ' + GetterUtil.getInteger(invoice_status) + ' - CAST(substr(invoice_id_ccs,LENGTH(invoice_id_ccs)-1,LENGTH(invoice_id_ccs)) AS int) = 1')
            if (last_invoice > 0) {
                last_invoice_status = ExpressionUtil.getInt(formVO, 'bill_port_services', 'account_status', 'id = ' + last_invoice)
                if (last_invoice_status == 1) {
                    update_old_invoice = ExpressionUtil.update(formVO, 'bill_port_services', 'account_status', '3', 'id = ' + last_invoice)
                }
            }
            invoice_vals.push(last_invoice);
            //System.out.println('last_invoice::::' + last_invoice)
            TransactionManager.beginTransaction();
            if (('' + format_type == 'zip' || '' + format_type == 'ZIP') || (('' + format_type != 'zip' && '' + format_type != 'ZIP') && is_exist_bill > 0)) {
                final_invoice_id = ExpressionUtil.update(formVO, 'bill_port_services', invoice_fields.toString(), invoice_vals.toString(), 'id=' + is_exist_bill);
            } else if (('' + format_type != 'zip' && '' + format_type != 'ZIP') && is_exist_bill == 0) {
                invoice_fields.push('invoice_id_ccs')
                invoice_fields.push('register_date'); //today
                invoice_fields.push('bill_services_type');
                invoice_fields.push('issue_date'); //issue_date
                invoice_fields.push('entry_voyage_number');
                invoice_vals.push('\'' + invoice_id + '\'');
                invoice_vals.push('\'' + today + '\'');
                invoice_vals.push(bill_services_type);
                invoice_vals.push('\'' + issue_date_miladi + '\'');
                invoice_vals.push('\'' + entry_voyage_number + '\'') //entry_voyage_number
                if (bill_services_type == 1) {
                    invoice_fields.push('invoice_serial_thc');
                    invoice_vals.push('\'' + invoice_thc_number + '\'');
                } else {
                    invoice_fields.push('invoice_serial_operator');
                    invoice_vals.push('\'' + invoice_thc_number + '\'');
                }
                final_invoice_id = my_insert(invoice_form_id, invoice_fields, invoice_vals, 0, true)
                //System.out.println('insertSanavie2222 : '+final_invoice_id)
                is_exist_bill = final_invoice_id;
                if (final_invoice_id > 0) {
                    final_invoice_id = true;
                }
            }
            TransactionManager.commitTransaction();
            //System.out.println('final_invoice_id:::' + final_invoice_id + ':: fields_array:' + invoice_fields.toString() + ':: values_array:' + invoice_vals.toString() + ':: tblid::' + is_exist_bill);
            System.out.println('final_invoice_id id : ' + final_invoice_id)
            if (final_invoice_id) {
                System.out.println('is_exist_bill id : ' + is_exist_bill)
                //ExpressionUtil.runFormAction(formVO, 70820, 73336, is_exist_bill);
                invoice_id_arr.push('' + invoice_id)
                suc_count = suc_count + 1;
                output += ' صورت حساب با شماره ' + invoice_id + ' در سامانه بارگذاری شد.\n'

            }
            //recalculate_amount = ExpressionUtil.runFormAction(formVO, 70820, 72216, final_invoice_id);

            services_form_id = 70864;
            if (service_obj.s_id.length > 0) {
                //System.out.println('service_obj.s_id.length ?>>>>>>>>>>>>>>>>>>'+service_obj.s_id.length)
                TransactionManager.beginTransaction();
                for (m = 0; m < service_obj.s_id.length; m++) {
                    values_services = [];
                    //System.out.println('service_obj.s_id[m]>>>>>>>>>>>>>>>>>>'+service_obj.s_id[m])
                    //System.out.println('final_invoice_id>>>>>>>>>>>>>>>>>>'+final_invoice_id)
                    item_s_id = service_obj.s_id[m];
                    item_quantity = service_obj.service_quantity[m];
                    item_service_tariff = service_obj.s_tariff[m];
                    item_with_off = service_obj.with_offs[m];
                    item_amount = service_obj.amounts[m];
                    item_amount_rial = service_obj.amount_rial[m];
                    values_services.push(is_exist_bill)
                    values_services.push(item_s_id)
                    values_services.push(item_quantity)
                    values_services.push(item_service_tariff)
                    values_services.push(item_with_off)
                    values_services.push(item_amount)
                    values_services.push(item_amount_rial)
                    service_inserted = my_insert(services_form_id, service_fields_inner, values_services, is_exist_bill, false)

                }
                TransactionManager.commitTransaction();
                if (final_invoice_id) {
                    System.out.println('is_exist_bill id : ' + is_exist_bill)
                    var run_round_rule = ExpressionUtil.runFormAction(formVO, 70820, 72216, is_exist_bill);
                }
            } else {
                isThereKhata += 1;
                output += 'خطایی در پردازش لیست خدمات ایجاد شده است، لطفا با ادمین سامانه در تماس باشید.\n'
                continue
            }
        } else {
            output += ' برای فاکتور با شماره ' + invoice_id + ' ابتدا باید در بارگذاری اولیه فایل ابتدایی را آپلود نمایید\n'
            continue;
        }


        //ExpressionUtil.runFormAction(formVO, 70820, 72497, is_exist_bill);
    } else {
        output = 'کاربر گرامی لطفا از فرمت قابل قبول برای بارگذاری فایل خود استفاده نمایید!\n';
        continue;
    }
    invoice_vals = [];
    values_array = [];
    box_op_values = [];
    port_or_values = [];
    service_values = [];
    values_services = [];
    port_des_values = [];
    gap = 0;
}
//System.out.println('suc_count:::'+suc_count);
if (error != '') {
    result = false;
    formVO.setValue('error', '' + error)
} else {
    error_msg = output + ' به تعداد ' + suc_count + ' فاکتور در سامانه بارگذاری شد';
    var end = System.currentTimeMillis();
    var time = end - start;
    time = time / 1000;
    result = ExpressionUtil.update(formVO, 'status_,process_time,message', '2,' + time + ',' + error_msg)
    formVO.getError()
    record_id = formVO.getRecordId();
    ExpressionUtil.archive(record_id);
}
function my_insert(form_id, fields_array, values_array, master_id, rules_boolean) {
    insert_res = ExpressionUtil.insertAndGetId(formVO, fields_array.toString(), values_array.toString(), form_id, master_id, rules_boolean, false)
    return insert_res;
}

// ma be in function meghdari k be donbale an hastim va sotuni k an meghdar bayad dar an bashad va chandomin bar k anra peyda kard midahim va tabee morede nazar shomare radif ra barmigardanad
function rowFinder(rowCount, cell_value, column_num, order_) {
    find_number = 0;
    for (var c = 1; c < rowCount; c++) { //take excel columns
        //System.out.println('c1 : '+c)
        var each_row = rows.getJSONArray(c);
        var finder = each_row.getString(column_num);
        if (column_num == 8) {
            //System.out.println('cell_value : '+cell_value)
            //System.out.println('each_row : '+each_row)
            //System.out.println('finder : '+finder)
            //System.out.println('column_num : '+column_num)
            //System.out.println('c : '+c)
        }
        if (finder == '' + cell_value) {
            var find_number = find_number + 1;
            if (order_ == find_number) {
                return c;
            }
        }
        //System.out.println('c2 : '+c)
    }
    //System.out.println('c : '+c)
    //System.out.println('xxxxxxxx : '+find_number)
    //System.out.println('c + 1 : '+(GetterUtil.getInteger(c) + GetterUtil.getInteger(1)))
    //System.out.println('rowCount : '+rowCount)
    if (find_number == 0 && (GetterUtil.getInteger(c) + GetterUtil.getInteger(1)) == rowCount) {
        //System.out.println('yyyyyyyyyyyyyyy : ')
        return 0;
    }
    return 0;
}

function _rowFinder(rowCount, cell_value, column_num, order_) {
    var find_number = 0;
    for (var c = 1; c < rowCount; c++) {
        var each_row = rows.getJSONArray(c);
        for (var ci = 1; ci < each_row.length(); ci++) {
            var finder = each_row.getString(ci);
            if (finder == '' + cell_value) {
                find_number = find_number + 1;
                if (order_ == find_number) {
                    return c;
                }
            }
        }
    }

    return 0;
}

function getRowValue(row, name) {
    for (var c = 1; c < row.length(); c++) {
        var cell = row.getString(c);
        if (cell == name) {
            var value = '';
            var start = c + 1;
            while (value == '' && start < 80) {
                value = row.getString(start);
                start++;
                if (value.indexOf(':') > -1) {
                    value = '';
                    break;
                }
            }
            return value;
        }
    }

    return '';
}