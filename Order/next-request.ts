export interface MenuItem {
    id?: number;
    name: string;
    price: number;
    description?: string;
    quantity?: number;
}


interface OrderRequestBody {
     selectedItems: MenuItem[],
     name: string,
     surname: string,
     email: string,
     address: 'Some address'
}

export async function POST(request: NextRequest){
    const body: OrderRequestBody = await request.json();
    const {selectedItems, name, surname, email, address } = body;
    const url = process.env.ORDER_SERVICE
    if (!url){
        return NextResponse.json({error: "ORDER SERVICE not set"}, {status:500});
    }
    try{
        const resp = await fetch(`${url}/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items:selectedItems,
                name:name,
                surname:surname,
                email:email,
                address:address,
            })

        }).then(res => {return res.json()});

        console.log(resp);

        return NextResponse.json({data:resp}, {status: 200});
    }
    catch(err){
        return NextResponse.json({error: (err as Error).message}, {status: 500});
    }
}