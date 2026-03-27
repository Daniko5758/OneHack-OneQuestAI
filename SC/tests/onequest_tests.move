#[test_only]
module onequest::onequest_tests {
    use one::test_scenario::{Self, Scenario};
    use one::coin::{Self};
    use one::clock::{Self};
    use std::string::{utf8};
    use onequest::core::{Self, CampaignVault, RelayerCap, OCT};

    // Dummy addresses untuk simulasi
    const ADMIN: address = @0x111;
    const USER: address = @0x222;
    const RELAYER: address = @0x333; 

    #[test]
    fun test_end_to_end_success_flow() {
        let mut scenario_val = test_scenario::begin(RELAYER);
        let scenario = &mut scenario_val;

        // 1. Inisialisasi Kontrak oleh Relayer (Backend)
        test_scenario::next_tx(scenario, RELAYER);
        {
            core::init_for_testing(test_scenario::ctx(scenario));
        };

        // 2. Admin membayar tepat 0.5 OCT untuk membuat campaign
        test_scenario::next_tx(scenario, ADMIN);
        {
            let mut vault = test_scenario::take_shared<CampaignVault>(scenario);
            // Mint dummy OCT sejumlah 500_000_000 (0.5 OCT)
            let valid_payment = coin::mint_for_testing<OCT>(500_000_000, test_scenario::ctx(scenario));
            
            core::pay_and_create_campaign(
                &mut vault,
                valid_payment,
                utf8(b"campaign_01"),
                test_scenario::ctx(scenario)
            );
            
            test_scenario::return_shared(vault);
        };

        // 3. Relayer mencatat quest selesai dan mencetak NFT untuk User
        test_scenario::next_tx(scenario, RELAYER);
        {
            let relayer_cap = test_scenario::take_from_sender<RelayerCap>(scenario);
            let mut clock = clock::create_for_testing(test_scenario::ctx(scenario));
            
            core::record_completion_and_mint_nft(
                &relayer_cap,
                utf8(b"quest_01"),
                utf8(b"campaign_01"),
                utf8(b"Badge 1"),
                utf8(b"Desc 1"),
                &clock,
                USER,
                test_scenario::ctx(scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_to_sender(scenario, relayer_cap);
        };

        test_scenario::end(scenario_val);
    }

    #[test]
    #[expected_failure(abort_code = core::E_INVALID_PAYMENT)]
    fun test_invalid_payment_fails() {
        let mut scenario_val = test_scenario::begin(RELAYER);
        let scenario = &mut scenario_val;

        // Inisialisasi
        test_scenario::next_tx(scenario, RELAYER);
        {
            core::init_for_testing(test_scenario::ctx(scenario));
        };

        // Admin mencoba membayar kurang dari 0.5 OCT (misal: 0.4 OCT)
        test_scenario::next_tx(scenario, ADMIN);
        {
            let mut vault = test_scenario::take_shared<CampaignVault>(scenario);
            let invalid_payment = coin::mint_for_testing<OCT>(400_000_000, test_scenario::ctx(scenario));
            
            // Transaksi ini harus gagal dan memunculkan E_INVALID_PAYMENT
            core::pay_and_create_campaign(
                &mut vault,
                invalid_payment,
                utf8(b"campaign_01"),
                test_scenario::ctx(scenario)
            );
            
            test_scenario::return_shared(vault);
        };

        test_scenario::end(scenario_val);
    }
}