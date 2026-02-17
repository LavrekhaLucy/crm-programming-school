
export const Header = () => {
    const name = 'crm-programming-school';
    console.log(name);

    return (
        <div className="w-full">
            <header className="bg-[#43a047] p-6 flex items-center justify-between">
                <div className="text-2xl font-bold text-white">
                Logo
                </div>

                <div className="w-50 h-10 flex items-center  text-2xl text-white gap-2 ">
                    admin
                    <button
                        type="button"
                        style={{ backgroundImage: `url('http://bigbird.space:81/static/media/admin.c305133bad8700df7d8be698c350c2bb.svg')` }}
                        className="bg-[#2e7d32] bg-center bg-no-repeat bg-size-[20px_20px] w-10 h-10 rounded-[5px]">
                    </button>

                    <button
                        type="button"
                        style={{ backgroundImage: `url('http://bigbird.space:81/static/media/logOut.7e73deefd22b4062b49d7ed47c46a9e1.svg')` }}
                        className="bg-[#2e7d32] bg-center bg-no-repeat bg-size-[20px_20px] w-10 h-10 rounded-[5px]">
                    </button>
                </div>

            </header>
        </div>
    );
};


