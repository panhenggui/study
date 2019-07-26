import requests
import time
import pymysql

IP = '192.168.100.117'
headers = {
    'Origin': f'http://{IP}:8080',
    'Referer': f'http://{IP}:8080/quantdo_page/pages/index.html',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537\
    .36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
}

def getToday():
    db = pymysql.connect(f"{IP}","gts","gts","gts")
    cursor = db.cursor()
     
    sql = "SELECT * FROM t_sync_systemstatus WHERE tradingday"
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for row in results:
            today = row[0]
    except:
        print ("Error: unable to fetch data")
    db.close()
    return today

def getTradingday():
    today = getToday()
    db = pymysql.connect(f"{IP}","gts","gts","gts")
    cursor = db.cursor()
    sql = "SELECT * FROM t_sys_calendar WHERE full_date"
    try:
        cursor.execute(sql)
        results = cursor.fetchall()
        for row in results:
            if int(today) < int(row[1]) and row[2] == '1':
                next_tradingday = row[1]
                break
    except:
       print ("Error: unable to fetch data")
    db.close()
    return today, next_tradingday

def login():
    data = {
        'params': '{"userName":"js","password":"123456","verification_code":"","extends":"null"}'
    }
    r = s.post(f'http://{IP}:8080/quantdo/logon',data = data, headers = headers)

def setCurrSettlePrice():
    login()
    data = {
        'params': '[true]'
    }
    r = s.post(f'http://{IP}:8080/quantdo/service/settlePriceService/setCurrSettlePrice', data = data, headers = headers)  
    print('setCurrSettlePrice---OK!')
    time.sleep(2)
    
def autoDailySettle(enter="0"):
    login()
    today, next_tradingday = getTradingday()
    data = {
        'params': f'["{today}","{next_tradingday}","{enter}"]'
    }
    s.post(f'http://{IP}:8080/quantdo/service/sysCalendarService/getNextTradeDate', data = {'params': f'["{today}"]'}, headers = headers)
    s.post(f'http://{IP}:8080/quantdo/service/settleStepDetailService/getSettleDeatil', data = {'params': f'["{today}"]'}, headers = headers)
    r = s.post(f'http://{IP}:8080/quantdo/service/settleStepDetailService/autoDailySettle', data = data, headers = headers)
    for i in range(10):
        try:
            resultFlag = eval(r.json()['data'])['resultFlag']
            if resultFlag == '0':
                print('Success!!!')
                break
            elif resultFlag == '1':
                print('Settled!!!')
                break
            elif resultFlag == '2':
                print('Need enter!!!')
                print("OK!")
                autoDailySettle(enter="1")
                break
        except Exception as ee:
            print('Failed!!!',ee)

if __name__ == '__main__':
    s = requests.session()
    setCurrSettlePrice()
    autoDailySettle()