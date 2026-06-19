type Props = {
    search: string;
    onSearch: (value: string) => void;
};

export default function Header({
    search,
    onSearch,
}: Props) {

    return (

        <header className="
            bg-white
            p-4
            rounded-xl
            shadow
        ">

            <input
                className="
                    w-full
                    border
                    rounded-lg
                    px-4
                    py-2
                    text-black
                "
                placeholder="
                    Buscar dirección...
                "
                value={search}
                onChange={(e) =>
                    onSearch(
                        e.target.value
                    )
                }
            />

        </header>

    );

}